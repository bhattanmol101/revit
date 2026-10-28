import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  type CreateShareRatingInput,
  createShareRating,
  getMyEntityRating,
  getEntityRatingSummary,
  getSharePostsForEntity,
  getShareRatingScore,
  type SharePostPage,
  updateShareRating,
} from "@/api/shares";
import {
  type LocalImage,
  readLocalImagesSequentially,
} from "@/lib/media/read-local-image";
import { queryKeys } from "@/lib/query/query-keys";

export type CreateShareRatingMutationInput = Omit<
  CreateShareRatingInput,
  "images"
> & {
  images: LocalImage[];
};

export function useMyEntityRating(entityId: string, authorId: string) {
  return useQuery({
    enabled: entityId.length > 0 && authorId.length > 0,
    queryFn: () => getMyEntityRating(entityId, authorId),
    queryKey: queryKeys.shares.mine(entityId, authorId),
    staleTime: 30_000,
  });
}

export function useEntityRatingSummary(entityId: string) {
  return useQuery({
    enabled: entityId.length > 0,
    queryFn: () => getEntityRatingSummary(entityId),
    queryKey: queryKeys.shares.summary(entityId),
    staleTime: 30_000,
  });
}

export function useShareRatingScore(postId: string) {
  return useQuery({
    enabled: postId.length > 0,
    queryFn: () => getShareRatingScore(postId),
    queryKey: queryKeys.shares.score(postId),
    staleTime: 30_000,
  });
}

export function useSharePostsByEntity(entityId: string) {
  return useInfiniteQuery<SharePostPage>({
    enabled: entityId.length > 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    initialPageParam: 0,
    queryFn: ({ pageParam, signal }) =>
      getSharePostsForEntity(entityId, pageParam as number, signal),
    queryKey: queryKeys.shares.byEntity(entityId),
  });
}

export function useCreateShareRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateShareRatingMutationInput) => {
      const images = await readLocalImagesSequentially(input.images);
      return createShareRating({ ...input, images });
    },
    onSuccess: (post, input) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.shares.mine(input.entityId, input.authorId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.shares.summary(input.entityId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.shares.byEntity(input.entityId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.posts.byId(post.id),
      });
    },
  });
}

export function useUpdateShareRating(
  postId: string,
  entityId: string,
  authorId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { body?: string; score: number }) =>
      updateShareRating(postId, input),
    onSuccess: (post) => {
      void Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.shares.mine(entityId, authorId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.shares.summary(entityId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.shares.byEntity(entityId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.shares.score(post.id),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.posts.byId(post.id),
        }),
      ]);
    },
  });
}
