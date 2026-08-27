import type { PostPage, PostWithDetails } from "@/api/posts";
import { getPostsByIds } from "@/api/posts";
import type { Restaurant } from "@/api/restaurants";
import { getRestaurantsByIds } from "@/api/restaurants";
import { supabase } from "@/lib/supabase/client";

import { normalizeApiError } from "./errors";
import { runApiRequest } from "./request";

const HOME_FEED_PAGE_SIZE = 10;

export type HomeFeedSharePost = PostWithDetails & {
  post_type: "SHARE";
  ratingScore: number;
  restaurant: Restaurant;
};

export type HomeFeedPost =
  | (PostWithDetails & { post_type: "ASK" })
  | HomeFeedSharePost;

export type HomeFeedPage = Omit<PostPage, "items"> & {
  items: HomeFeedPost[];
};

export async function getHomeFeed(offset = 0): Promise<HomeFeedPage> {
  const postIds = await runApiRequest(
    async (signal) => {
      const { data, error } = await supabase
        .rpc("get_home_feed", {
          p_limit: HOME_FEED_PAGE_SIZE + 1,
          p_offset: offset,
        })
        .abortSignal(signal);

      if (error) {
        throw normalizeApiError(error, "We could not load your feed.");
      }

      return data.map((post) => post.id);
    },
    { retries: 1 },
  );

  const hasNextPage = postIds.length > HOME_FEED_PAGE_SIZE;
  const visiblePostIds = postIds.slice(0, HOME_FEED_PAGE_SIZE);

  const posts = await getPostsByIds(visiblePostIds);
  const sharePosts = posts.filter(
    (
      post,
    ): post is PostWithDetails & { entity_id: string; post_type: "SHARE" } =>
      post.post_type === "SHARE" && post.entity_id !== null,
  );

  if (sharePosts.length === 0) {
    return {
      items: posts as HomeFeedPost[],
      nextOffset: hasNextPage ? offset + HOME_FEED_PAGE_SIZE : undefined,
    };
  }

  const [ratings, restaurants] = await Promise.all([
    getShareScores(sharePosts.map((post) => post.id)),
    getRestaurantsByIds(sharePosts.map((post) => post.entity_id)),
  ]);
  const ratingsByPostId = new Map(
    ratings.map((rating) => [rating.post_id, rating.score]),
  );
  const restaurantsById = new Map(
    restaurants.map((restaurant) => [restaurant.id, restaurant]),
  );

  return {
    items: posts.flatMap((post) => {
      if (post.post_type === "ASK") return [post as HomeFeedPost];

      const ratingScore = ratingsByPostId.get(post.id);
      const restaurant = post.entity_id
        ? restaurantsById.get(post.entity_id)
        : undefined;

      return ratingScore === undefined || !restaurant
        ? []
        : [
            {
              ...post,
              post_type: "SHARE" as const,
              ratingScore,
              restaurant,
            },
          ];
    }),
    nextOffset: hasNextPage ? offset + HOME_FEED_PAGE_SIZE : undefined,
  };
}

function getShareScores(postIds: string[]) {
  return runApiRequest(
    async (signal) => {
      const { data, error } = await supabase
        .from("entity_ratings")
        .select("post_id, score")
        .in("post_id", postIds)
        .abortSignal(signal);

      if (error) {
        throw normalizeApiError(error, "We could not load restaurant ratings.");
      }

      return data;
    },
    { retries: 1 },
  );
}
