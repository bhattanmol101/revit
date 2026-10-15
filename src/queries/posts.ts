import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  cleanUpPendingPostImages,
  createAskPost,
  createForumAskPost,
  createForumSharePost,
  deletePost,
  getAskPostsByAuthor,
  getPost,
  type PostPage,
  type UpdateAskPostInput,
  updateAskPost,
} from "@/api/posts";
import { useEffect } from "react";
import {
  type LocalImage,
  readLocalImagesSequentially,
} from "@/lib/media/read-local-image";
import { queryKeys } from "@/lib/query/query-keys";

export type CreateAskPostMutationInput = {
  authorId: string;
  body?: string;
  images: LocalImage[];
};

export function usePostImageCleanup(userId: string) {
  const cleanup = useMutation({
    mutationFn: cleanUpPendingPostImages,
    retry: 2,
  });
  const startCleanup = cleanup.mutate;

  useEffect(() => {
    if (userId) startCleanup();
  }, [startCleanup, userId]);
}

export function useCreateAskPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateAskPostMutationInput) => {
      const images = await readLocalImagesSequentially(input.images);

      return createAskPost({ ...input, images });
    },
    onSuccess: (post) => {
      queryClient.removeQueries({
        exact: true,
        queryKey: queryKeys.posts.byId(post.id),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.posts.byAuthor(post.author_id),
      });
    },
  });
}

export function useCreateForumAskPost(forumId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      input: CreateAskPostMutationInput & { forumId: string },
    ) =>
      createForumAskPost({
        ...input,
        images: await readLocalImagesSequentially(input.images),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.forums.posts(forumId),
      });
    },
  });
}

export function useCreateForumSharePost(forumId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      input: CreateAskPostMutationInput & {
        entityId: string;
        forumId: string;
      },
    ) =>
      createForumSharePost({
        ...input,
        images: await readLocalImagesSequentially(input.images),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.forums.posts(forumId),
      });
    },
  });
}

export function usePost(postId: string) {
  return useQuery({
    enabled: postId.length > 0,
    queryFn: ({ signal }) => getPost(postId, signal),
    queryKey: queryKeys.posts.byId(postId),
    refetchInterval: 50 * 60 * 1000,
    staleTime: 50 * 60 * 1000,
  });
}

export function useAskPostsByAuthor(authorId: string) {
  return useInfiniteQuery({
    enabled: authorId.length > 0,
    getNextPageParam: (lastPage: PostPage) => lastPage.nextOffset,
    initialPageParam: 0,
    queryFn: ({ pageParam, signal }) =>
      getAskPostsByAuthor(authorId, pageParam, signal),
    queryKey: queryKeys.posts.byAuthor(authorId),
    refetchInterval: 50 * 60 * 1000,
    staleTime: 50 * 60 * 1000,
  });
}

export function useUpdateAskPost(postId: string, authorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateAskPostInput) => updateAskPost(postId, input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.posts.byId(postId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.posts.byAuthor(authorId),
        }),
      ]);
    },
  });
}

export function useDeletePost(authorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: async (_result, postId) => {
      queryClient.removeQueries({
        exact: true,
        queryKey: queryKeys.posts.byId(postId),
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.posts.byAuthor(authorId),
      });
    },
  });
}
