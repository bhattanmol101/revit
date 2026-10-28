import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createPersonalPick,
  deletePersonalPick,
  getPersonalPick,
  getPersonalPicksByAuthor,
  getPicksFromFollowing,
  getFollowedPickIds,
  setPickFollow,
  type SavePersonalPickInput,
  updatePersonalPick,
} from "@/api/picks";
import { queryKeys } from "@/lib/query/query-keys";

export function usePersonalPick(pickId: string) {
  return useQuery({
    enabled: pickId.length > 0,
    queryFn: () => getPersonalPick(pickId),
    queryKey: queryKeys.picks.byId(pickId),
    staleTime: 30_000,
  });
}

export function usePersonalPicksByAuthor(authorId: string) {
  return useQuery({
    enabled: authorId.length > 0,
    queryFn: () => getPersonalPicksByAuthor(authorId),
    queryKey: queryKeys.picks.byAuthor(authorId),
    staleTime: 30_000,
  });
}

export function useCreatePersonalPick(authorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPersonalPick,
    onSuccess: (pick) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.picks.byAuthor(authorId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.picks.byId(pick.id),
      });
    },
  });
}

export function useUpdatePersonalPick(pickId: string, authorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SavePersonalPickInput) =>
      updatePersonalPick(pickId, input),
    onSuccess: (pick) => {
      void Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.picks.byAuthor(authorId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.picks.byId(pick.id),
        }),
      ]);
    },
  });
}

export function useDeletePersonalPick(pickId: string, authorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deletePersonalPick(pickId),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: queryKeys.picks.byId(pickId) });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.picks.byAuthor(authorId),
      });
    },
  });
}

export function usePicksFromFollowing(userId: string) {
  return useQuery({
    enabled: Boolean(userId),
    queryKey: ["picks", "following-directory", userId],
    queryFn: () => getPicksFromFollowing(userId),
    staleTime: 30_000,
  });
}

export function useFollowedPicks(userId: string) {
  return useQuery({
    enabled: Boolean(userId),
    queryKey: ["picks", "followed", userId],
    queryFn: () => getFollowedPickIds(userId),
  });
}

export function useTogglePickFollow(userId: string, pickId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (follow: boolean) => setPickFollow(userId, pickId, follow),
    onSuccess: () =>
      client.invalidateQueries({ queryKey: ["picks", "followed", userId] }),
  });
}
