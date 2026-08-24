import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteAskRating,
  getMyAskRating,
  type Rating,
  saveAskRating,
} from "@/api/ratings";
import { queryKeys } from "@/lib/query/query-keys";

export function useMyAskRating(postId: string, raterId: string) {
  return useQuery({
    enabled: postId.length > 0 && raterId.length > 0,
    queryFn: () => getMyAskRating(postId, raterId),
    queryKey: queryKeys.ratings.mine(postId, raterId),
  });
}

export function useSetMyAskRating(postId: string, raterId: string) {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.ratings.mine(postId, raterId);

  return useMutation({
    mutationFn: (score: number | null) =>
      score === null
        ? deleteAskRating(postId, raterId).then(() => null)
        : saveAskRating(postId, raterId, score),
    onMutate: async (score) => {
      await queryClient.cancelQueries({ exact: true, queryKey });
      const previous = queryClient.getQueryData<Rating | null>(queryKey);

      if (score === null) {
        queryClient.setQueryData(queryKey, null);
      } else {
        const now = new Date().toISOString();
        queryClient.setQueryData<Rating>(queryKey, {
          created_at: previous?.created_at ?? now,
          post_id: postId,
          rater_id: raterId,
          score,
          updated_at: now,
        });
      }

      return { previous };
    },
    onError: (_error, _score, context) => {
      if (context?.previous === undefined) {
        queryClient.removeQueries({ exact: true, queryKey });
      } else {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSuccess: (rating) => {
      queryClient.setQueryData(queryKey, rating);
    },
    onSettled: () => queryClient.invalidateQueries({ exact: true, queryKey }),
  });
}
