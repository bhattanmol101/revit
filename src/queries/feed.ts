import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getHomeFeed,
  type HomeFeedCursor,
  type HomeFeedMode,
  type HomeFeedPage,
} from "@/api/feed";
import { queryKeys } from "@/lib/query/query-keys";

export function useHomeFeed(mode: HomeFeedMode) {
  return useInfiniteQuery<HomeFeedPage>({
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as HomeFeedCursor | undefined,
    queryFn: ({ pageParam, signal }) =>
      getHomeFeed(mode, pageParam as HomeFeedCursor | undefined, signal),
    queryKey: queryKeys.feed.home(mode),
  });
}
