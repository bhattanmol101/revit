import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getFollowCounts,
  getProfile,
  getProfileByUsername,
  updateProfile,
  type Profile,
  type UpdateProfileInput,
} from "@/api/profiles";
import { queryKeys } from "@/lib/query/query-keys";

export function useProfile(profileId: string) {
  return useQuery({
    enabled: profileId.length > 0,
    queryFn: () => getProfile(profileId),
    queryKey: queryKeys.profiles.byId(profileId),
  });
}

export function useProfileByUsername(username: string) {
  return useQuery({
    enabled: username.length > 0,
    queryFn: () => getProfileByUsername(username),
    queryKey: queryKeys.profiles.byUsername(username),
  });
}

export function useFollowCounts(profileId: string) {
  return useQuery({
    enabled: profileId.length > 0,
    queryFn: () => getFollowCounts(profileId),
    queryKey: queryKeys.profiles.followCounts(profileId),
  });
}

export function useUpdateProfile(profileId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => {
      if (!profileId) {
        throw new Error("You must be signed in to update your profile.");
      }

      return updateProfile(profileId, input);
    },
    onSuccess: (profile) => {
      const previousProfile = queryClient.getQueryData<Profile | null>(
        queryKeys.profiles.byId(profileId),
      );

      queryClient.setQueryData(queryKeys.profiles.byId(profileId), profile);
      queryClient.setQueryData(
        queryKeys.profiles.byUsername(profile.username),
        profile,
      );

      if (previousProfile && previousProfile.username !== profile.username) {
        queryClient.removeQueries({
          exact: true,
          queryKey: queryKeys.profiles.byUsername(previousProfile.username),
        });
      }
    },
  });
}
