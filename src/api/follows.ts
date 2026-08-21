import type { Profile } from "./profiles";
import { normalizeApiError } from "./errors";
import { runApiRequest } from "./request";

import { supabase } from "@/lib/supabase/client";

const FOLLOW_PAGE_SIZE = 20;

export type FollowProfile = Pick<
  Profile,
  "avatar_url" | "bio" | "display_name" | "id" | "username"
>;

export type FollowPage = {
  items: FollowProfile[];
  nextOffset?: number;
};

export function getFollowStatus(
  followerId: string,
  followingId: string,
): Promise<boolean> {
  return runApiRequest(
    async (signal) => {
      const { data, error } = await supabase
        .from("follows")
        .select("follower_id")
        .eq("follower_id", followerId)
        .eq("following_id", followingId)
        .abortSignal(signal)
        .maybeSingle();

      if (error) {
        throw normalizeApiError(error, "We could not check the follow status.");
      }

      return data !== null;
    },
    { retries: 1 },
  );
}

export function followProfile(
  followerId: string,
  followingId: string,
): Promise<void> {
  return runApiRequest(async (signal) => {
    const { error } = await supabase
      .from("follows")
      .insert({ follower_id: followerId, following_id: followingId })
      .abortSignal(signal);

    if (error) {
      throw normalizeApiError(error, "We could not follow this person.");
    }
  });
}

export function unfollowProfile(
  followerId: string,
  followingId: string,
): Promise<void> {
  return runApiRequest(async (signal) => {
    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", followerId)
      .eq("following_id", followingId)
      .abortSignal(signal);

    if (error) {
      throw normalizeApiError(error, "We could not unfollow this person.");
    }
  });
}

export function getFollowers(
  profileId: string,
  offset = 0,
): Promise<FollowPage> {
  return runApiRequest(
    async (signal) => {
      const { data, error } = await supabase
        .from("follows")
        .select(
          "profile:profiles!follows_follower_id_fkey(id, username, display_name, bio, avatar_url)",
        )
        .eq("following_id", profileId)
        .order("created_at", { ascending: false })
        .order("follower_id", { ascending: true })
        .range(offset, offset + FOLLOW_PAGE_SIZE)
        .abortSignal(signal);

      if (error) {
        throw normalizeApiError(error, "We could not load followers.");
      }

      const hasNextPage = data.length > FOLLOW_PAGE_SIZE;

      return {
        items: data.slice(0, FOLLOW_PAGE_SIZE).map(({ profile }) => profile),
        nextOffset: hasNextPage ? offset + FOLLOW_PAGE_SIZE : undefined,
      };
    },
    { retries: 1 },
  );
}

export function getFollowing(
  profileId: string,
  offset = 0,
): Promise<FollowPage> {
  return runApiRequest(
    async (signal) => {
      const { data, error } = await supabase
        .from("follows")
        .select(
          "profile:profiles!follows_following_id_fkey(id, username, display_name, bio, avatar_url)",
        )
        .eq("follower_id", profileId)
        .order("created_at", { ascending: false })
        .order("following_id", { ascending: true })
        .range(offset, offset + FOLLOW_PAGE_SIZE)
        .abortSignal(signal);

      if (error) {
        throw normalizeApiError(error, "We could not load following.");
      }

      const hasNextPage = data.length > FOLLOW_PAGE_SIZE;

      return {
        items: data.slice(0, FOLLOW_PAGE_SIZE).map(({ profile }) => profile),
        nextOffset: hasNextPage ? offset + FOLLOW_PAGE_SIZE : undefined,
      };
    },
    { retries: 1 },
  );
}
