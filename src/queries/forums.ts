import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createForum,
  deleteForum,
  getForum,
  getForums,
  joinForum,
  leaveForum,
} from "@/api/forums";
import { getForumPosts, type PostPage } from "@/api/posts";
import { queryKeys } from "@/lib/query/query-keys";

export function useForums() {
  return useQuery({
    queryFn: getForums,
    queryKey: queryKeys.forums.all,
    staleTime: 30_000,
  });
}

export function useCreateForum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createForum,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.forums.all });
    },
  });
}

export function useDeleteForum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteForum,
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: queryKeys.forums.all }),
  });
}

export function useForum(forumId: string, userId: string) {
  return useQuery({
    enabled: forumId.length > 0,
    queryFn: () => getForum(forumId, userId),
    queryKey: queryKeys.forums.byId(forumId, userId),
    staleTime: 30_000,
  });
}

export function useForumPosts(forumId: string) {
  return useInfiniteQuery<PostPage>({
    enabled: forumId.length > 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    initialPageParam: 0,
    queryFn: ({ pageParam }) => getForumPosts(forumId, pageParam as number),
    queryKey: queryKeys.forums.posts(forumId),
  });
}

export function useForumMembership(forumId: string, userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shouldJoin: boolean) =>
      shouldJoin ? joinForum(forumId, userId) : leaveForum(forumId, userId),
    onSuccess: () => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.forums.all }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.forums.byId(forumId, userId),
        }),
      ]);
    },
  });
}
