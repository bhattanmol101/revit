import { supabase } from "@/lib/supabase/client";
import type { Tables, TablesUpdate } from "@/lib/supabase/database.types";

import { normalizeApiError } from "./errors";
import { runApiRequest } from "./request";

const POST_IMAGES_BUCKET = "post-images";
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const POST_PAGE_SIZE = 10;
const SIGNED_URL_TTL_SECONDS = 60 * 60;

export type Post = Tables<"posts">;
export type PostMedia = Tables<"post_media">;

export type PostAuthor = Pick<
  Tables<"profiles">,
  "avatar_url" | "display_name" | "id" | "username"
>;

export type PostWithDetails = Post & {
  author: PostAuthor;
  media: Array<PostMedia & { signedUrl: string }>;
};

export type PostPage = {
  items: PostWithDetails[];
  nextOffset?: number;
};

export type UpdateAskPostInput = Pick<TablesUpdate<"posts">, "body" | "title">;

type RawPostWithDetails = Post & {
  author: PostAuthor;
  media: PostMedia[];
};

const POST_DETAILS_SELECT =
  "id, author_id, post_type, entity_id, title, body, created_at, updated_at, author:profiles!posts_author_id_fkey(id, username, display_name, avatar_url), media:post_media(id, post_id, storage_path, position, alt_text, created_at)";

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

      try {
        await attachPostImages({
          authorId: input.authorId,
          images: input.images,
          postId: post.id,
          signal,
        });
        return post;
      } catch (error) {
        await cleanUpFailedPost(post.id, []);
        throw error;
      }
    },
    { timeoutMs: 60_000 },
  );
}

export async function attachPostImages({
  authorId,
  images,
  postId,
  signal,
}: {
  authorId: string;
  images: AskImageUpload[];
  postId: string;
  signal: AbortSignal;
}) {
  const uploadedPaths: string[] = [];

  try {
    for (const [index, image] of images.entries()) {
      const storagePath = `${authorId}/${postId}/${index + 1}.${image.extension}`;
      const { error: uploadError } = await supabase.storage
        .from(POST_IMAGES_BUCKET)
        .upload(storagePath, image.data, {
          cacheControl: "31536000",
          contentType: image.contentType,
          upsert: false,
        });

      if (uploadError) {
        throw normalizeApiError(uploadError, "An image could not be uploaded.");
      }

      uploadedPaths.push(storagePath);
    }

    if (uploadedPaths.length === 0) return;

    const { error: mediaError } = await supabase
      .from("post_media")
      .insert(
        uploadedPaths.map((storagePath, index) => ({
          position: index + 1,
          post_id: postId,
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
  } catch (error) {
    if (uploadedPaths.length > 0) {
      await supabase.storage.from(POST_IMAGES_BUCKET).remove(uploadedPaths);
    }
    throw error;
  }
}

export function getPost(postId: string): Promise<PostWithDetails | null> {
  return runApiRequest(
    async (signal) => {
      const { data, error } = await supabase
        .from("posts")
        .select(POST_DETAILS_SELECT)
        .eq("id", postId)
        .abortSignal(signal)
        .maybeSingle();

      if (error) {
        throw normalizeApiError(error, "We could not load this post.");
      }

      if (!data) return null;

      const [post] = await signPostMedia([data]);
      return post;
    },
    { retries: 1 },
  );
}

export function getAskPostsByAuthor(
  authorId: string,
  offset = 0,
): Promise<PostPage> {
  return runApiRequest(
    async (signal) => {
      const { data, error } = await supabase
        .from("posts")
        .select(POST_DETAILS_SELECT)
        .eq("author_id", authorId)
        .eq("post_type", "ASK")
        .order("created_at", { ascending: false })
        .order("id", { ascending: true })
        .range(offset, offset + POST_PAGE_SIZE)
        .abortSignal(signal);

      if (error) {
        throw normalizeApiError(error, "We could not load Ask posts.");
      }

      const hasNextPage = data.length > POST_PAGE_SIZE;
      const items = await signPostMedia(data.slice(0, POST_PAGE_SIZE));

      return {
        items,
        nextOffset: hasNextPage ? offset + POST_PAGE_SIZE : undefined,
      };
    },
    { retries: 1 },
  );
}

export function updateAskPost(
  postId: string,
  input: UpdateAskPostInput,
): Promise<Post> {
  const title = input.title?.trim() ?? "";
  const body = input.body?.trim() || null;

  if (title.length < 1 || title.length > 120) {
    throw new Error("The title must be between 1 and 120 characters.");
  }

  if ((body?.length ?? 0) > 2000) {
    throw new Error("The description must be 2,000 characters or fewer.");
  }

  return runApiRequest(async (signal) => {
    const { data, error } = await supabase
      .from("posts")
      .update({ body, title })
      .eq("id", postId)
      .eq("post_type", "ASK")
      .select(
        "id, author_id, post_type, entity_id, title, body, created_at, updated_at",
      )
      .abortSignal(signal)
      .single();

    if (error) {
      throw normalizeApiError(error, "We could not update this Ask post.");
    }

    return data;
  });
}

export function deletePost(postId: string): Promise<void> {
  return runApiRequest(async (signal) => {
    const { data: media, error: mediaError } = await supabase
      .from("post_media")
      .select("storage_path")
      .eq("post_id", postId)
      .abortSignal(signal);

    if (mediaError) {
      throw normalizeApiError(
        mediaError,
        "We could not prepare this post for deletion.",
      );
    }

    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId)
      .select("id")
      .abortSignal(signal)
      .single();

    if (deleteError) {
      throw normalizeApiError(deleteError, "We could not delete this post.");
    }

    const storagePaths = media.map(({ storage_path }) => storage_path);

    if (storagePaths.length > 0) {
      await supabase.storage.from(POST_IMAGES_BUCKET).remove(storagePaths);
    }
  });
}

async function signPostMedia(
  posts: RawPostWithDetails[],
): Promise<PostWithDetails[]> {
  const storagePaths = posts.flatMap((post) =>
    post.media.map(({ storage_path }) => storage_path),
  );

  if (storagePaths.length === 0) {
    return posts.map((post) => ({ ...post, media: [] }));
  }

  const { data, error } = await supabase.storage
    .from(POST_IMAGES_BUCKET)
    .createSignedUrls(storagePaths, SIGNED_URL_TTL_SECONDS);

  if (error) {
    throw normalizeApiError(error, "We could not load post images.");
  }

  const signedUrls = new Map(
    data.map(({ path, signedUrl, error: signedUrlError }) => {
      if (!path || !signedUrl || signedUrlError) {
        throw new Error(signedUrlError ?? "A post image could not be loaded.");
      }

      return [path, signedUrl] as const;
    }),
  );

  return posts.map((post) => ({
    ...post,
    media: [...post.media]
      .sort((first, second) => first.position - second.position)
      .map((media) => {
        const signedUrl = signedUrls.get(media.storage_path);

        if (!signedUrl) {
          throw new Error("A post image could not be loaded.");
        }

        return { ...media, signedUrl };
      }),
  }));
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
