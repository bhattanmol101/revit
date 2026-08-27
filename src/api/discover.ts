import type { Restaurant } from "@/api/restaurants";
import { supabase } from "@/lib/supabase/client";

import { normalizeApiError } from "./errors";
import { runApiRequest } from "./request";

const DISCOVER_RESULT_LIMIT = 8;

export type DiscoveryProfile = {
  avatarUrl: string | null;
  displayName: string;
  username: string;
};

export type DiscoveryPost = {
  authorName: string;
  body: string | null;
  id: string;
  postType: "ASK" | "SHARE";
  title: string | null;
};

export type DiscoverResults = {
  posts: DiscoveryPost[];
  profiles: DiscoveryProfile[];
  restaurants: Restaurant[];
};

export function discover(query: string): Promise<DiscoverResults> {
  const searchTerm = normalizeSearchTerm(query);

  if (searchTerm.length < 2) {
    return Promise.resolve({ posts: [], profiles: [], restaurants: [] });
  }

  const pattern = `%${escapeLikePattern(searchTerm)}%`;

  return runApiRequest(
    async (signal) => {
      const [profilesResult, postsResult, restaurantsResult] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("username, display_name, avatar_url")
            .or(`username.ilike.${pattern},display_name.ilike.${pattern}`)
            .order("username", { ascending: true })
            .limit(DISCOVER_RESULT_LIMIT)
            .abortSignal(signal),
          supabase
            .from("posts")
            .select(
              "id, post_type, title, body, author:profiles!posts_author_id_fkey(display_name)",
            )
            .or(`title.ilike.${pattern},body.ilike.${pattern}`)
            .order("created_at", { ascending: false })
            .limit(DISCOVER_RESULT_LIMIT)
            .abortSignal(signal),
          supabase
            .from("entities")
            .select(
              "id, name, address_line_1, address_line_2, locality, administrative_area, country_code, postal_code, category:entity_categories!inner(slug)",
            )
            .eq("category.slug", "restaurant")
            .or(
              `normalized_name.ilike.${pattern},normalized_locality.ilike.${pattern},normalized_address.ilike.${pattern}`,
            )
            .order("normalized_name", { ascending: true })
            .limit(DISCOVER_RESULT_LIMIT)
            .abortSignal(signal),
        ]);

      if (profilesResult.error) {
        throw normalizeApiError(
          profilesResult.error,
          "We could not search people.",
        );
      }

      if (postsResult.error) {
        throw normalizeApiError(
          postsResult.error,
          "We could not search posts.",
        );
      }

      if (restaurantsResult.error) {
        throw normalizeApiError(
          restaurantsResult.error,
          "We could not search restaurants.",
        );
      }

      return {
        posts: postsResult.data.map((post) => ({
          authorName: post.author.display_name,
          body: post.body,
          id: post.id,
          postType: post.post_type,
          title: post.title,
        })),
        profiles: profilesResult.data.map((profile) => ({
          avatarUrl: profile.avatar_url,
          displayName: profile.display_name,
          username: profile.username,
        })),
        restaurants: restaurantsResult.data.map(
          ({ category: _category, ...restaurant }) => restaurant,
        ),
      };
    },
    { retries: 1 },
  );
}

function normalizeSearchTerm(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function escapeLikePattern(value: string) {
  return value.replace(/[\\%_]/g, "\\$&");
}
