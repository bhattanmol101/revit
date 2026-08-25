import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  type CreateShareRatingInput,
  createShareRating,
  getMyRestaurantRating,
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
          queryKey: queryKeys.posts.byId(post.id),
        }),
      ]);
    },
  });
}
