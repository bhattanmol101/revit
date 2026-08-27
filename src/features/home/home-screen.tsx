import { useQueryClient } from "@tanstack/react-query";
import { Link } from "expo-router";
import {
  ArrowRight,
  Compass,
  MessageCircleQuestion,
  RefreshCw,
  Sparkles,
} from "lucide-react-native";
import { FlatList, Platform, RefreshControl, View } from "react-native";

import type { HomeFeedPost } from "@/api/feed";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { AskPostCard } from "@/features/posts/ask-post-card";
import { SharePostCard } from "@/features/posts/share-post-card";
import { queryKeys } from "@/lib/query/query-keys";
import { routes } from "@/lib/routes";
import { useHomeFeed } from "@/queries/feed";

export function HomeScreen() {
  const feed = useHomeFeed();
  const queryClient = useQueryClient();
  const posts = feed.data?.pages.flatMap((page) => page.items) ?? [];
  const refreshFeed = async () => {
    await queryClient.resetQueries({ queryKey: queryKeys.feed.home });
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <FlatList
        contentContainerClassName="gap-3 px-3 py-4 sm:px-6 sm:py-6"
        data={posts}
        keyExtractor={(post) => post.id}
        ListEmptyComponent={<FeedEmpty feed={feed} />}
        ListFooterComponent={<FeedFooter feed={feed} />}
        ListHeaderComponent={
          <FeedHeader
            isRefreshing={feed.isFetching && !feed.isFetchingNextPage}
            onRefresh={() => void refreshFeed()}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={feed.isFetching && !feed.isFetchingNextPage}
            onRefresh={() => void refreshFeed()}
          />
        }
        renderItem={({ item }) => <HomeFeedItem post={item} />}
        onEndReached={() => {
          if (feed.hasNextPage && !feed.isFetchingNextPage) {
            void feed.fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.4}
      />
    </SafeAreaView>
  );
}

function FeedHeader({
  isRefreshing,
  onRefresh,
}: {
  isRefreshing: boolean;
  onRefresh: () => void;
}) {
  return (
    <View className="mx-auto w-full max-w-5xl gap-5">
      <View className="rounded-lg bg-primary px-4 py-5 sm:px-6 sm:py-7">
        <View className="max-w-2xl gap-3">
          <View className="self-start flex-row items-center gap-1.5 rounded-md bg-white/15 px-2 py-1">
            <Icon as={Sparkles} className="size-4 text-white" />
            <Text className="text-sm font-semibold text-white">
              Your people. Their taste.
            </Text>
          </View>
          <Text
            variant="h1"
            className="max-w-xl text-left text-2xl leading-8 text-white sm:text-4xl sm:leading-[46px]"
          >
            Good taste is better shared.
          </Text>
          <Text className="max-w-xl text-sm leading-5 text-white/85 sm:text-base">
            Ask the people you trust, trade honest ratings, and keep every
            recommendation worth remembering.
          </Text>
          <View className="flex-row flex-wrap gap-2 pt-1">
            <Link href={routes.createAsk} asChild>
              <Button className="bg-white shadow-none" size="lg">
                <Icon as={MessageCircleQuestion} className="text-primary" />
                <Text className="text-primary">Ask something</Text>
              </Button>
            </Link>
            <Link href={routes.discover} asChild>
              <Button
                className="border-white/30 bg-white/10"
                size="lg"
                variant="outline"
              >
                <Icon as={Compass} className="text-white" />
                <Text className="text-white">Find people</Text>
              </Button>
            </Link>
          </View>
        </View>
      </View>

      <View className="flex-row items-center justify-between gap-3">
        <View className="min-w-0 flex-1 gap-1">
          <Text variant="h3">Your feed</Text>
          <Text variant="muted" className="text-base">
            Fresh questions and recommendations from people you follow.
          </Text>
        </View>
        {Platform.OS === "web" ? (
          <Button
            accessibilityLabel="Refresh feed"
            disabled={isRefreshing}
            size="sm"
            variant="outline"
            onPress={onRefresh}
          >
            <Icon
              as={RefreshCw}
              className={isRefreshing ? "animate-spin" : undefined}
            />
            <Text>{isRefreshing ? "Refreshing…" : "Refresh"}</Text>
          </Button>
        ) : null}
      </View>
    </View>
  );
}

function HomeFeedItem({ post }: { post: HomeFeedPost }) {
  return (
    <View className="mx-auto w-full max-w-3xl">
      {post.post_type === "ASK" ? (
        <AskPostCard post={post} />
      ) : (
        <SharePostCard post={post} restaurant={post.restaurant} />
      )}
    </View>
  );
}

function FeedEmpty({ feed }: { feed: ReturnType<typeof useHomeFeed> }) {
  if (feed.isLoading) {
    return (
      <View className="mx-auto w-full max-w-3xl gap-3">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </View>
    );
  }

  if (feed.isError) {
    return (
      <View className="mx-auto w-full max-w-3xl items-start gap-3 rounded-lg border border-border bg-card p-3 shadow-none">
        <Text className="font-medium">Your feed couldn’t be loaded.</Text>
        <Text variant="muted">Check your connection and try again.</Text>
        <Button variant="outline" onPress={() => void feed.refetch()}>
          <Text>Try again</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="mx-auto w-full max-w-3xl items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-none sm:flex-row sm:items-center">
      <View className="size-10 items-center justify-center rounded-md bg-accent">
        <Icon as={Sparkles} className="size-5 text-accent-foreground" />
      </View>
      <View className="min-w-0 flex-1 gap-1.5">
        <Text className="text-base font-bold">Your feed will appear here.</Text>
        <Text variant="muted" className="max-w-xl text-sm leading-5">
          Follow a few people and their Ask posts and restaurant ratings will
          land here.
        </Text>
      </View>
      <Link href={routes.discover} asChild>
        <Button variant="secondary">
          <Text>Discover people</Text>
          <Icon as={ArrowRight} />
        </Button>
      </Link>
    </View>
  );
}

function FeedFooter({ feed }: { feed: ReturnType<typeof useHomeFeed> }) {
  if (!feed.hasNextPage && !feed.isFetchingNextPage) return null;

  return (
    <View className="mx-auto w-full max-w-3xl items-center py-2">
      <Button
        disabled={!feed.hasNextPage || feed.isFetchingNextPage}
        variant="outline"
        onPress={() => void feed.fetchNextPage()}
      >
        <Text>{feed.isFetchingNextPage ? "Loading…" : "Load more"}</Text>
      </Button>
    </View>
  );
}
