import { Stack, useLocalSearchParams } from "expo-router";

import {
  ProfileLoadingScreen,
  ProfileMessageScreen,
} from "@/features/profile/profile-state-screen";
import { ProfileView } from "@/features/profile/profile-view";
import { useProfileByUsername } from "@/queries/profiles";

export default function UserProfileScreen() {
  const params = useLocalSearchParams<{ username?: string | string[] }>();
  const username = Array.isArray(params.username)
    ? params.username[0]
    : (params.username ?? "");
  const profile = useProfileByUsername(username.toLowerCase());

  if (profile.isLoading) {
    return <ProfileLoadingScreen />;
  }

  if (profile.isError) {
    return (
      <ProfileMessageScreen
        title="Profile unavailable"
        description="We couldn&apos;t load this profile. Check your connection and try again."
        action={() => void profile.refetch()}
      />
    );
  }

  if (!profile.data) {
    return (
      <ProfileMessageScreen
        title="Profile not found"
        description="This username doesn&apos;t belong to an available profile."
      />
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: `@${profile.data.username}` }} />
      <ProfileView profile={profile.data} />
    </>
  );
}
