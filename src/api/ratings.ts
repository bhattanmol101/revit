import type { Tables } from "@/lib/supabase/database.types";
import { supabase } from "@/lib/supabase/client";

import { normalizeApiError } from "./errors";
import { runApiRequest } from "./request";

export type Rating = Tables<"ratings">;
export type RatingSummary = {
  averageScore: number | null;
  ratingCount: number;
};

const RATING_SELECT =
  "post_id, rater_id, score, created_at, updated_at" as const;

export function getAskRatingSummary(postId: string): Promise<RatingSummary> {
  return runApiRequest(
    async (signal) => {
      const { data, error } = await supabase
        .rpc("get_ask_rating_summary", { target_post_id: postId })
        .abortSignal(signal);

      if (error) {
        throw normalizeApiError(error, "We could not load the rating summary.");
      }

      const summary = data[0] as
        | { average_score: number | null; rating_count: number }
        | undefined;

      return {
        averageScore: summary?.average_score ?? null,
        ratingCount: summary?.rating_count ?? 0,
      };
    },
    { retries: 1 },
  );
}

export function getMyAskRating(
  postId: string,
  raterId: string,
): Promise<Rating | null> {
  return runApiRequest(
    async (signal) => {
      const { data, error } = await supabase
        .from("ratings")
        .select(RATING_SELECT)
        .eq("post_id", postId)
        .eq("rater_id", raterId)
        .abortSignal(signal)
        .maybeSingle();

      if (error) {
        throw normalizeApiError(error, "We could not load your rating.");
      }

      return data;
    },
    { retries: 1 },
  );
}

export function saveAskRating(
  postId: string,
  raterId: string,
  score: number,
): Promise<Rating> {
  if (!Number.isInteger(score) || score < 1 || score > 5) {
    throw new Error("Choose a rating from 1 to 5.");
  }

  return runApiRequest(async (signal) => {
    const { data: updatedRating, error: updateError } = await supabase
      .from("ratings")
      .update({ score })
      .eq("post_id", postId)
      .eq("rater_id", raterId)
      .select(RATING_SELECT)
      .abortSignal(signal)
      .maybeSingle();

    if (updateError) {
      throw normalizeApiError(updateError, "We could not update your rating.");
    }

    if (updatedRating) return updatedRating;

    const { data: createdRating, error: insertError } = await supabase
      .from("ratings")
      .insert({ post_id: postId, rater_id: raterId, score })
      .select(RATING_SELECT)
      .abortSignal(signal)
      .single();

    if (insertError) {
      throw normalizeApiError(insertError, "We could not create your rating.");
    }

    return createdRating;
  });
}

export function deleteAskRating(
  postId: string,
  raterId: string,
): Promise<void> {
  return runApiRequest(async (signal) => {
    const { error } = await supabase
      .from("ratings")
      .delete()
      .eq("post_id", postId)
      .eq("rater_id", raterId)
      .abortSignal(signal);

    if (error) {
      throw normalizeApiError(error, "We could not remove your rating.");
    }
  });
}
