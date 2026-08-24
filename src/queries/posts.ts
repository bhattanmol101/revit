import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createAskPost,
  deletePost,
  getAskPostsByAuthor,
  getPost,
  updateAskPost,
  type PostPage,
  type UpdateAskPostInput,
} from "@/api/posts";
import { readLocalImage, type LocalImage } from "@/lib/media/read-local-image";
import { queryKeys } from "@/lib/query/query-keys";

export type CreateAskPostMutationInput = {
  authorId: string;
  body?: string;
  images: LocalImage[];
  title: string;
};

export function useCreateAskPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateAskPostMutationInput) => {
      const images = await Promise.all(input.images.map(readLocalImage));

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

export function usePost(postId: string) {
  return useQuery({
    enabled: postId.length > 0,
    queryFn: () => getPost(postId),
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
    queryFn: ({ pageParam }) => getAskPostsByAuthor(authorId, pageParam),
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
