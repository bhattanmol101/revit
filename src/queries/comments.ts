import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  type CommentPage,
  createReply,
  createTopLevelComment,
  deleteComment,
  getCommentCount,
  getTopLevelComments,
  updateComment,
} from "@/api/comments";
import { queryKeys } from "@/lib/query/query-keys";

export function useCommentCount(postId: string) {
  return useQuery({
    enabled: postId.length > 0,
    queryFn: () => getCommentCount(postId),
    queryKey: queryKeys.comments.count(postId),
    staleTime: 30_000,
  });
}

export function useTopLevelComments(postId: string) {
  return useInfiniteQuery({
    enabled: postId.length > 0,
    getNextPageParam: (lastPage: CommentPage) => lastPage.nextOffset,
    initialPageParam: 0,
    queryFn: ({ pageParam }) => getTopLevelComments(postId, pageParam),
    queryKey: queryKeys.comments.byPost(postId),
  });
}

export function useCreateTopLevelComment(postId: string, authorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: string) =>
      createTopLevelComment({ authorId, body, postId }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.byPost(postId),
      }),
  });
}

export function useCreateReply(postId: string, authorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ body, parentId }: { body: string; parentId: string }) =>
      createReply({ authorId, body, parentId, postId }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.byPost(postId),
      }),
  });
}

export function useUpdateComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ body, commentId }: { body: string; commentId: string }) =>
      updateComment(commentId, body),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.byPost(postId),
      }),
  });
}

export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.byPost(postId),
      }),
  });
}
