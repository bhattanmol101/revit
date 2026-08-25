import type { AskImageUpload, Post } from "@/api/posts";
import { attachPostImages, deletePost } from "@/api/posts";
import { supabase } from "@/lib/supabase/client";

import { normalizeApiError } from "./errors";
import { runApiRequest } from "./request";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export type MyRestaurantRating = {
  body: string | null;
  postId: string;
  score: number;
};

export type CreateShareRatingInput = {
  authorId: string;
  body?: string;
  entityId: string;
  images: AskImageUpload[];
  score: number;
};

export function getMyRestaurantRating(
  entityId: string,
  authorId: string,
): Promise<MyRestaurantRating | null> {
  return runApiRequest(
    async (signal) => {
      const { data, error } = await supabase
        .from("entity_ratings")
        .select("post_id, score, post:posts!entity_ratings_post_id_fkey(body)")
        .eq("entity_id", entityId)
        .eq("author_id", authorId)
        .abortSignal(signal)
        .maybeSingle();

      if (error) {
        throw normalizeApiError(
          error,
          "We could not load your restaurant rating.",
        );
      }

      if (!data) return null;

      return {
        body: data.post?.body ?? null,
        postId: data.post_id,
        score: data.score,
      };
    },
    { retries: 1 },
  );
}

export async function createShareRating(
  input: CreateShareRatingInput,
): Promise<Post> {
  validateShareRating(input);

  return runApiRequest(
    async (signal) => {
      const { data, error } = await supabase
        .rpc("create_share_rating_post", {
          p_body: nullIfBlank(input.body),
          p_entity_id: input.entityId,
          p_score: input.score,
        })
        .abortSignal(signal)
        .single();

      if (error) {
        throw normalizeApiError(
          error,
          "We could not publish your restaurant rating.",
        );
      }

      const post = data as Post;

      if (!post) {
        throw new Error("We could not publish your restaurant rating.");
      }

      try {
        await attachPostImages({
          authorId: input.authorId,
          images: input.images,
          postId: post.id,
          signal,
        });
        return post;
      } catch (uploadError) {
        await deletePost(post.id).catch(() => undefined);
        throw uploadError;
      }
    },
    { timeoutMs: 60_000 },
  );
}

export function updateShareRating(
  postId: string,
  input: Pick<CreateShareRatingInput, "body" | "score">,
): Promise<Post> {
  validateScore(input.score);

  if ((input.body?.trim().length ?? 0) > 2_000) {
    throw new Error("The review must be 2,000 characters or fewer.");
  }

  return runApiRequest(async (signal) => {
    const { data, error } = await supabase
      .rpc("update_share_rating_post", {
        p_body: nullIfBlank(input.body),
        p_post_id: postId,
        p_score: input.score,
      })
      .abortSignal(signal)
      .single();

    if (error) {
      throw normalizeApiError(
        error,
        "We could not update your restaurant rating.",
      );
    }

    return data as Post;
  });
}

function validateShareRating(input: CreateShareRatingInput) {
  if (!input.authorId || !input.entityId) {
    throw new Error("Choose a restaurant before publishing.");
  }

  validateScore(input.score);

  if ((input.body?.trim().length ?? 0) > 2_000) {
    throw new Error("The review must be 2,000 characters or fewer.");
  }

  if (input.images.length > 3) {
    throw new Error("A restaurant rating can contain up to three images.");
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

function validateScore(score: number) {
  if (!Number.isInteger(score) || score < 1 || score > 5) {
    throw new Error("Choose a rating from 1 to 5.");
  }
}

function nullIfBlank(value: string | undefined) {
  return value?.trim() || undefined;
}
