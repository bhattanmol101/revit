import type { Tables } from "@/lib/supabase/database.types";
import { supabase } from "@/lib/supabase/client";

import { normalizeApiError } from "./errors";
import { runApiRequest } from "./request";

const POST_IMAGES_BUCKET = "post-images";
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export type Post = Tables<"posts">;

export type AskImageUpload = {
  contentType:
    | "image/heic"
    | "image/heif"
    | "image/jpeg"
    | "image/png"
    | "image/webp";
  data: ArrayBuffer;
  extension: "heic" | "heif" | "jpeg" | "jpg" | "png" | "webp";
};

export type CreateAskPostInput = {
  authorId: string;
  body?: string;
  images: AskImageUpload[];
  title: string;
};

export async function createAskPost(input: CreateAskPostInput): Promise<Post> {
  validateAskPost(input);

  return runApiRequest(
    async (signal) => {
      const { data: post, error: postError } = await supabase
        .from("posts")
        .insert({
          author_id: input.authorId,
          body: input.body?.trim() || null,
          post_type: "ASK",
          title: input.title.trim(),
        })
        .select(
          "id, author_id, post_type, entity_id, title, body, created_at, updated_at",
        )
        .abortSignal(signal)
        .single();

      if (postError) {
        throw normalizeApiError(
          postError,
          "We could not create your Ask post.",
        );
      }

      const uploadedPaths: string[] = [];

      try {
        for (const [index, image] of input.images.entries()) {
          const position = index + 1;
          const storagePath = `${input.authorId}/${post.id}/${position}.${image.extension}`;
          const { error: uploadError } = await supabase.storage
            .from(POST_IMAGES_BUCKET)
            .upload(storagePath, image.data, {
              cacheControl: "31536000",
              contentType: image.contentType,
              upsert: false,
            });

          if (uploadError) {
            throw normalizeApiError(
              uploadError,
              "An image could not be uploaded.",
            );
          }

          uploadedPaths.push(storagePath);
        }

        if (uploadedPaths.length > 0) {
          const { error: mediaError } = await supabase
            .from("post_media")
            .insert(
              uploadedPaths.map((storagePath, index) => ({
                position: index + 1,
                post_id: post.id,
                storage_path: storagePath,
              })),
            )
            .abortSignal(signal);

          if (mediaError) {
            throw normalizeApiError(
              mediaError,
              "We could not attach the images to your post.",
            );
          }
        }

        return post;
      } catch (error) {
        await cleanUpFailedPost(post.id, uploadedPaths);
        throw error;
      }
    },
    { timeoutMs: 60_000 },
  );
}

function validateAskPost(input: CreateAskPostInput) {
  const titleLength = input.title.trim().length;
  const bodyLength = input.body?.trim().length ?? 0;

  if (!input.authorId) {
    throw new Error("You must be signed in to create a post.");
  }

  if (titleLength < 1 || titleLength > 120) {
    throw new Error("The title must be between 1 and 120 characters.");
  }

  if (bodyLength > 2000) {
    throw new Error("The description must be 2,000 characters or fewer.");
  }

  if (input.images.length > 3) {
    throw new Error("An Ask post can contain up to three images.");
  }

  for (const image of input.images) {
    if (
      image.data.byteLength === 0 ||
      image.data.byteLength > MAX_IMAGE_BYTES
    ) {
      throw new Error("Each image must be smaller than 10 MB.");
    }
  }
}

async function cleanUpFailedPost(postId: string, storagePaths: string[]) {
  if (storagePaths.length > 0) {
    await supabase.storage.from(POST_IMAGES_BUCKET).remove(storagePaths);
  }

  await supabase.from("posts").delete().eq("id", postId);
}
