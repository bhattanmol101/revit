import { useInfiniteQuery } from "@tanstack/react-query";
import { getHomeFeed } from "@/api/feed";
import type { PostPage } from "@/api/posts";
import { queryKeys } from "@/lib/query/query-keys";

export function useHomeFeed() {
  return useInfiniteQuery<PostPage>({
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    initialPageParam: 0,
    queryFn: ({ pageParam }) => getHomeFeed(pageParam as number),
    queryKey: queryKeys.feed.home,
  });
}
