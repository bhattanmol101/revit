import { Link } from "expo-router";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";

import type { Profile } from "@/api/profiles";
import type { PostWithDetails } from "@/api/posts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { AskPostCard } from "@/features/posts/ask-post-card";
import { routes } from "@/lib/routes";
import { useAuth } from "@/providers/auth-provider";
import { useFollowStatus, useFollowToggle } from "@/queries/follows";
import { useAskPostsByAuthor } from "@/queries/posts";

import { useFollowCounts } from "@/queries/profiles";

type ProfileViewProps = {
  isOwnProfile?: boolean;
  profile: Profile;
};

const PROFILE_SECTIONS = [
  {
    description: "Curated restaurant picks will appear here.",
    title: "Picks",
  },
  {
    description: "Forum memberships and activity will appear here.",
    title: "Forums",
  },
] as const;

export function ProfileView({
  isOwnProfile = false,
  profile,
}: ProfileViewProps) {
  const { user } = useAuth();
  const isOwn = isOwnProfile || user?.id === profile.id;
  const counts = useFollowCounts(profile.id);
  const posts = useAskPostsByAuthor(profile.id);
  const followStatus = useFollowStatus(user?.id ?? "", profile.id);
  const followToggle = useFollowToggle(user?.id ?? "", profile.id);
  const initials = getInitials(profile.display_name);

  const refresh = async () => {
    await Promise.all([
      counts.refetch(),
      posts.refetch(),
      ...(isOwn ? [] : [followStatus.refetch()]),
    ]);
  };

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      edges={isOwnProfile ? ["top", "bottom"] : ["bottom"]}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="mx-auto w-full max-w-4xl gap-8 px-5 py-8 sm:px-8"
        refreshControl={
          <RefreshControl
            refreshing={
              counts.isRefetching ||
              posts.isRefetching ||
              followStatus.isRefetching
            }
            onRefresh={() => void refresh()}
          />
        }
      >
        <View className="gap-5 sm:flex-row sm:items-center">
          <Avatar
            alt={`${profile.display_name}'s avatar`}
            className="size-24 border border-border"
          >
            {profile.avatar_url ? (
              <AvatarImage
                accessibilityLabel={`${profile.display_name}'s avatar`}
                source={{ uri: profile.avatar_url }}
              />
            ) : null}
            <AvatarFallback>
              <Text className="text-2xl font-semibold">{initials}</Text>
            </AvatarFallback>
          </Avatar>

          <View className="min-w-0 flex-1 gap-2">
            <View className="gap-1">
              <Text variant="h1" className="text-left text-3xl">
                {profile.display_name}
              </Text>
              <Text variant="muted" className="text-base">
                @{profile.username}
              </Text>
            </View>

            <Text className="max-w-2xl leading-6 text-foreground">
              {profile.bio?.trim() ||
                (isOwnProfile
                  ? "Add a bio to tell people what you like."
                  : "No bio yet.")}
            </Text>

            {!isOwn ? (
              <Button
                className="mt-2 self-start"
                disabled={followStatus.isLoading || followToggle.isPending}
                variant={followStatus.data ? "outline" : "default"}
                onPress={() =>
                  followToggle.mutate(!(followStatus.data ?? false))
                }
              >
                <Text>
                  {followToggle.isPending
                    ? "Updating…"
                    : followStatus.data
                      ? "Following"
                      : "Follow"}
                </Text>
              </Button>
            ) : null}

            {!isOwn && (followStatus.isError || followToggle.isError) ? (
              <Text variant="small" className="text-destructive">
                {followToggle.error?.message ??
                  "We couldn’t load the follow status. Pull to refresh."}
              </Text>
            ) : null}
          </View>
        </View>

        <FollowCounts
          followers={counts.data?.followers}
          following={counts.data?.following}
          isLoading={counts.isLoading}
          username={profile.username}
        />

        {counts.isError ? (
          <Card className="gap-3 border-destructive/40 py-4">
            <CardContent className="gap-3">
              <Text variant="small" className="text-destructive">
                We couldn&apos;t load follow totals.
              </Text>
              <Button
                variant="outline"
                size="sm"
                className="self-start"
                onPress={() => void counts.refetch()}
              >
                <Text>Try again</Text>
              </Button>
            </CardContent>
          </Card>
        ) : null}

        <ProfilePosts
          hasNextPage={posts.hasNextPage}
          isError={posts.isError}
          isFetchingNextPage={posts.isFetchingNextPage}
          isLoading={posts.isLoading}
          loadMore={() => void posts.fetchNextPage()}
          posts={posts.data?.pages.flatMap((page) => page.items) ?? []}
          retry={() => void posts.refetch()}
        />

        <View className="gap-4">
          {PROFILE_SECTIONS.map((section) => (
            <Card key={section.title} className="gap-3 py-5">
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Text variant="muted">{section.description}</Text>
              </CardContent>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfilePosts({
  hasNextPage,
  isError,
  isFetchingNextPage,
  isLoading,
  loadMore,
  posts,
  retry,
}: {
  hasNextPage: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  loadMore: () => void;
  posts: PostWithDetails[];
  retry: () => void;
}) {
  return (
    <View className="gap-4">
      <Text variant="h2" className="border-0 pb-0 text-2xl">
        Posts
      </Text>

      {isLoading ? (
        <View className="gap-3">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </View>
      ) : null}

      {isError ? (
        <Card className="gap-3 border-destructive/40 py-5">
          <CardContent className="gap-3">
            <Text variant="small" className="text-destructive">
              We couldn’t load Ask posts.
            </Text>
            <Button variant="outline" className="self-start" onPress={retry}>
              <Text>Try again</Text>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !isError && posts.length === 0 ? (
        <Card className="py-5">
          <CardContent>
            <Text variant="muted">No Ask posts yet.</Text>
          </CardContent>
        </Card>
      ) : null}

      {posts.map((post) => (
        <AskPostCard key={post.id} post={post} />
      ))}

      {hasNextPage ? (
        <Button
          disabled={isFetchingNextPage}
          variant="outline"
          className="self-center"
          onPress={loadMore}
        >
          {isFetchingNextPage ? <ActivityIndicator /> : null}
          <Text>{isFetchingNextPage ? "Loading…" : "Load more"}</Text>
        </Button>
      ) : null}
    </View>
  );
}

function FollowCounts({
  followers,
  following,
  isLoading,
  username,
}: {
  followers?: number;
  following?: number;
  isLoading: boolean;
  username: string;
}) {
  return (
    <View className="flex-row gap-8 border-y border-border py-4">
      <Link href={routes.followers(username)} asChild>
        <Button variant="ghost" className="h-auto items-start px-0 py-0">
          <Count label="Followers" value={followers} isLoading={isLoading} />
        </Button>
      </Link>
      <Link href={routes.following(username)} asChild>
        <Button variant="ghost" className="h-auto items-start px-0 py-0">
          <Count label="Following" value={following} isLoading={isLoading} />
        </Button>
      </Link>
    </View>
  );
}

function Count({
  isLoading,
  label,
  value,
}: {
  isLoading: boolean;
  label: string;
  value?: number;
}) {
  return (
    <View className="gap-1">
      {isLoading ? (
        <Skeleton className="h-6 w-10" />
      ) : (
        <Text className="text-lg font-semibold">{value ?? 0}</Text>
      )}
      <Text variant="muted">{label}</Text>
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
