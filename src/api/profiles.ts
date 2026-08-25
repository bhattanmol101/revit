import type { Tables, TablesUpdate } from "@/lib/supabase/database.types";
import { supabase } from "@/lib/supabase/client";

import { normalizeApiError } from "./errors";
import { runApiRequest } from "./request";

export type Profile = Tables<"profiles">;

export type FollowCounts = {
  followers: number;
  following: number;
};

export type UpdateProfileInput = Pick<
  TablesUpdate<"profiles">,
  "display_name" | "username"
>;

export function getProfile(userId: string): Promise<Profile | null> {
  return runApiRequest(
    async (signal) => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, username, display_name, bio, avatar_url, created_at, updated_at",
        )
        .eq("id", userId)
        .abortSignal(signal)
        .maybeSingle();

      if (error) {
        throw normalizeApiError(error, "We could not load your profile.");
      }

      return data;
    },
    { retries: 1 },
  );
}

export function getProfileByUsername(
  username: string,
): Promise<Profile | null> {
  return runApiRequest(
    async (signal) => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, username, display_name, bio, avatar_url, created_at, updated_at",
        )
        .eq("username", username)
        .abortSignal(signal)
        .maybeSingle();

      if (error) {
        throw normalizeApiError(error, "We could not load this profile.");
      }

      return data;
    },
    { retries: 1 },
  );
}

export function getFollowCounts(profileId: string): Promise<FollowCounts> {
  return runApiRequest(
    async (signal) => {
      const [followersResult, followingResult] = await Promise.all([
        supabase
          .from("follows")
          .select("following_id", { count: "exact", head: true })
          .eq("following_id", profileId)
          .abortSignal(signal),
        supabase
          .from("follows")
          .select("follower_id", { count: "exact", head: true })
          .eq("follower_id", profileId)
          .abortSignal(signal),
      ]);

      if (followersResult.error) {
        throw normalizeApiError(
          followersResult.error,
          "We could not load follower totals.",
        );
      }

      if (followingResult.error) {
        throw normalizeApiError(
          followingResult.error,
          "We could not load following totals.",
        );
      }

      return {
        followers: followersResult.count ?? 0,
        following: followingResult.count ?? 0,
      };
    },
    { retries: 1 },
  );
}

export function updateProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<Profile> {
  return runApiRequest(async (signal) => {
    const { data, error } = await supabase
      .from("profiles")
      .update(input)
      .eq("id", userId)
      .select(
        "id, username, display_name, bio, avatar_url, created_at, updated_at",
      )
      .abortSignal(signal)
      .single();

    if (error) {
      throw normalizeApiError(error, "We could not update your profile.");
    }

    return data;
  });
}
