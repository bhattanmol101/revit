import type { PostPage } from "@/api/posts";
import { getPostsByIds } from "@/api/posts";
import { supabase } from "@/lib/supabase/client";

import { normalizeApiError } from "./errors";
import { runApiRequest } from "./request";

const HOME_FEED_PAGE_SIZE = 10;

export async function getHomeFeed(offset = 0): Promise<PostPage> {
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

  return {
    items: await getPostsByIds(visiblePostIds),
    nextOffset: hasNextPage ? offset + HOME_FEED_PAGE_SIZE : undefined,
  };
}
