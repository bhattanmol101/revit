import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  type CreateShareRatingInput,
  createShareRating,
  getMyRestaurantRating,
  getRestaurantRatingSummary,
  getSharePostsByRestaurant,
  getShareRatingScore,
  type SharePostPage,
  updateShareRating,
} from "@/api/shares";
import { type LocalImage, readLocalImage } from "@/lib/media/read-local-image";
import { queryKeys } from "@/lib/query/query-keys";

export type CreateShareRatingMutationInput = Omit<
  CreateShareRatingInput,
  "images"
> & {
  images: LocalImage[];
};

export function useMyRestaurantRating(entityId: string, authorId: string) {
  return useQuery({
    enabled: entityId.length > 0 && authorId.length > 0,
    queryFn: () => getMyRestaurantRating(entityId, authorId),
    queryKey: queryKeys.shares.mine(entityId, authorId),
    staleTime: 30_000,
  });
}

export function useRestaurantRatingSummary(entityId: string) {
  return useQuery({
    enabled: entityId.length > 0,
    queryFn: () => getRestaurantRatingSummary(entityId),
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

export function useSharePostsByRestaurant(entityId: string) {
  return useInfiniteQuery<SharePostPage>({
    enabled: entityId.length > 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getSharePostsByRestaurant(entityId, pageParam as number),
    queryKey: queryKeys.shares.byRestaurant(entityId),
  });
}

export function useCreateShareRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateShareRatingMutationInput) => {
      const images = await Promise.all(input.images.map(readLocalImage));
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
        queryKey: queryKeys.shares.byRestaurant(input.entityId),
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
          queryKey: queryKeys.shares.byRestaurant(entityId),
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
