import { Link, Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, FlatList, View } from "react-native";

import type { FollowProfile } from "@/api/follows";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { routes } from "@/lib/routes";
import { useFollowList } from "@/queries/follows";
import { useProfileByUsername } from "@/queries/profiles";

type FollowListScreenProps = {
  kind: "followers" | "following";
};

export function FollowListScreen({ kind }: FollowListScreenProps) {
  const params = useLocalSearchParams<{ username?: string | string[] }>();
  const username = Array.isArray(params.username)
    ? params.username[0]
    : (params.username ?? "");
  const profile = useProfileByUsername(username.toLowerCase());
  const list = useFollowList(profile.data?.id ?? "", kind);
  const title = kind === "followers" ? "Followers" : "Following";
  const items = list.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <Stack.Screen options={{ title }} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerClassName="mx-auto w-full max-w-4xl grow px-5 py-5 sm:px-8"
        ItemSeparatorComponent={() => <View className="h-px bg-border" />}
        ListEmptyComponent={
          <FollowListState
            profileLoading={profile.isLoading}
            profileMissing={!profile.isLoading && !profile.data}
            listLoading={list.isLoading}
            isError={profile.isError || list.isError}
            kind={kind}
            retry={() =>
              void (profile.isError ? profile.refetch() : list.refetch())
            }
          />
        }
        ListFooterComponent={
          list.isFetchingNextPage ? (
            <ActivityIndicator className="my-5" />
          ) : null
        }
        onEndReached={() => {
          if (list.hasNextPage && !list.isFetchingNextPage) {
            void list.fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.4}
        refreshing={list.isRefetching && !list.isFetchingNextPage}
        renderItem={({ item }) => <FollowProfileRow profile={item} />}
        onRefresh={() => void list.refetch()}
      />
    </SafeAreaView>
  );
}

function FollowProfileRow({ profile }: { profile: FollowProfile }) {
  return (
    <Link href={routes.user(profile.username)} asChild>
      <Button
        variant="ghost"
        className="h-auto w-full justify-start gap-4 rounded-none px-0 py-4"
      >
        <Avatar alt={`${profile.display_name}'s avatar`} className="size-12">
          {profile.avatar_url ? (
            <AvatarImage
              accessibilityLabel={`${profile.display_name}'s avatar`}
              source={{ uri: profile.avatar_url }}
            />
          ) : null}
          <AvatarFallback>
            <Text className="font-semibold">
              {getInitials(profile.display_name)}
            </Text>
          </AvatarFallback>
        </Avatar>
        <View className="min-w-0 flex-1 items-start gap-0.5">
          <Text className="font-semibold">{profile.display_name}</Text>
          <Text variant="muted">@{profile.username}</Text>
          {profile.bio?.trim() ? (
            <Text
              numberOfLines={1}
              variant="small"
              className="text-muted-foreground"
            >
              {profile.bio}
            </Text>
          ) : null}
        </View>
      </Button>
    </Link>
  );
}

function FollowListState({
  isError,
  kind,
  listLoading,
  profileLoading,
  profileMissing,
  retry,
}: {
  isError: boolean;
  kind: "followers" | "following";
  listLoading: boolean;
  profileLoading: boolean;
  profileMissing: boolean;
  retry: () => void;
}) {
  if (profileLoading || listLoading) {
    return (
      <View className="flex-1 items-center justify-center gap-3 py-16">
        <ActivityIndicator />
        <Text variant="muted">Loading {kind}…</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center gap-3 py-16">
        <Text variant="muted" className="text-center">
          We couldn’t load this list.
        </Text>
        <Button variant="outline" onPress={retry}>
          <Text>Try again</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center gap-2 py-16">
      <Text variant="large">
        {profileMissing
          ? "Profile not found"
          : kind === "followers"
            ? "No followers yet"
            : "Not following anyone yet"}
      </Text>
      {!profileMissing ? (
        <Text variant="muted" className="text-center">
          {kind === "followers"
            ? "People who follow this profile will appear here."
            : "People followed by this profile will appear here."}
        </Text>
      ) : null}
    </View>
  );
}

function getInitials(displayName: string) {
  return displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
