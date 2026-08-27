import { useInfiniteQuery } from "@tanstack/react-query";
import { getHomeFeed, type HomeFeedPage } from "@/api/feed";
import { queryKeys } from "@/lib/query/query-keys";

export function useHomeFeed() {
  return useInfiniteQuery<HomeFeedPage>({
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    initialPageParam: 0,
    queryFn: ({ pageParam }) => getHomeFeed(pageParam as number),
    queryKey: queryKeys.feed.home,
  });
}
