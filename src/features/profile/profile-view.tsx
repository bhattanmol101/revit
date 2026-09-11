import { Link } from "expo-router";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import type { PostWithDetails } from "@/api/posts";
import type { Profile } from "@/api/profiles";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackState } from "@/components/ui/feedback-state";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { AskPostCard } from "@/features/posts/ask-post-card";
import { routes } from "@/lib/routes";
import { useAuth } from "@/providers/auth-provider";
import { useFollowStatus, useFollowToggle } from "@/queries/follows";
import { usePersonalPicksByAuthor } from "@/queries/picks";
import { useAskPostsByAuthor } from "@/queries/posts";

import { useFollowCounts } from "@/queries/profiles";

type ProfileViewProps = {
  isOwnProfile?: boolean;
  profile: Profile;
};

const PROFILE_SECTIONS = [
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
        contentContainerClassName="mx-auto w-full max-w-4xl gap-5 px-3 py-4 sm:px-6"
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
        <View className="gap-3 rounded-lg border border-border bg-card p-3 sm:flex-row sm:items-center">
          <Avatar
            alt={`${profile.display_name}'s avatar`}
            className="size-20 border-2 border-card shadow-none"
          >
            {profile.avatar_url ? (
              <AvatarImage
                accessibilityLabel={`${profile.display_name}'s avatar`}
                source={{ uri: profile.avatar_url }}
              />
            ) : null}
            <AvatarFallback>
              <Text className="text-xl font-semibold">{initials}</Text>
            </AvatarFallback>
          </Avatar>

          <View className="min-w-0 flex-1 gap-2">
            <View className="gap-1">
              <Text variant="h1" className="text-left text-2xl">
                {profile.display_name}
              </Text>
              <Text variant="muted" className="text-sm">
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
                className="mt-2 min-w-28 self-start"
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
          <FeedbackState
            actionLabel="Retry"
            onAction={() => void counts.refetch()}
            title="Couldn’t load follow totals."
            variant="error"
          />
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

        <ProfilePicks profileId={profile.id} />

        <View className="gap-3 sm:flex-row">
          {PROFILE_SECTIONS.map((section) => (
            <Card
              key={section.title}
              className="flex-1 gap-2 rounded-lg border-0 bg-accent py-3 shadow-none"
            >
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

function ProfilePicks({ profileId }: { profileId: string }) {
  const picks = usePersonalPicksByAuthor(profileId);

  return (
    <View className="gap-3">
      <Text variant="h2" className="text-xl">
        Picks
      </Text>
      {picks.isLoading ? <Skeleton className="h-20 w-full" /> : null}
      {picks.isError ? (
        <FeedbackState
          actionLabel="Retry"
          onAction={() => void picks.refetch()}
          title="Couldn’t load Picks."
          variant="error"
        />
      ) : null}
      {!picks.isLoading && !picks.isError && picks.data?.length === 0 ? (
        <FeedbackState title="No Picks yet" />
      ) : null}
      {picks.data?.map((pick) => (
        <Link key={pick.id} href={routes.pick(pick.id)} asChild>
          <Card className="gap-1 py-3 shadow-none">
            <CardHeader>
              <CardTitle>{pick.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Text variant="muted">
                {pick.description?.trim() || "Restaurant collection"}
              </Text>
            </CardContent>
          </Card>
        </Link>
      ))}
    </View>
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
    <View className="-mx-2 gap-3 sm:mx-0">
      <Text variant="h2" className="border-0 px-2 pb-0 text-xl sm:px-0">
        Posts
      </Text>

      {isLoading ? (
        <View className="gap-3">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </View>
      ) : null}

      {isError ? (
        <FeedbackState
          actionLabel="Retry"
          onAction={retry}
          title="Couldn’t load Ask posts."
          variant="error"
        />
      ) : null}

      {!isLoading && !isError && posts.length === 0 ? (
        <FeedbackState title="No Ask posts yet" />
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
    <View className="flex-row gap-3">
      <Link href={routes.followers(username)} asChild>
        <Button
          variant="secondary"
          className="h-auto min-w-28 items-start rounded-md px-3 py-2.5"
        >
          <Count label="Followers" value={followers} isLoading={isLoading} />
        </Button>
      </Link>
      <Link href={routes.following(username)} asChild>
        <Button
          variant="secondary"
          className="h-auto min-w-28 items-start rounded-md px-3 py-2.5"
        >
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
