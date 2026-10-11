import { Link } from "expo-router";
import { MapPin } from "lucide-react-native";
import { useDeferredValue, useState } from "react";
import { View } from "react-native";

import type {
  DiscoverResults,
  DiscoveryPost,
  DiscoveryProfile,
} from "@/api/discover";
import type { Restaurant } from "@/api/restaurants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ContentSkeleton } from "@/components/ui/content-skeleton";
import { FeedbackState } from "@/components/ui/feedback-state";
import { Icon } from "@/components/ui/icon";
import { PageScrollView } from "@/components/ui/page-scroll-view";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { SearchInput } from "@/components/ui/search-input";
import { Text } from "@/components/ui/text";
import { routes } from "@/lib/routes";
import { useDiscover } from "@/queries/discover";

type ResultFilter = "people" | "posts" | "restaurants";

export function DiscoverScreen() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const results = useDiscover(deferredQuery);
  const hasSearchTerm = query.trim().length >= 2;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["left", "right"]}>
      <PageScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-6"
      >
        <View className="gap-1">
          <Text variant="h1" className="text-left">
            Discover
          </Text>
          <Text variant="muted">Find people, posts, and restaurants.</Text>
        </View>

        <SearchInput
          accessibilityLabel="Search Revit"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Search people, posts, or restaurants"
          value={query}
          onChangeText={setQuery}
        />

        {!hasSearchTerm ? (
          <SearchState
            description="Enter at least two characters to search across the available community content."
            title="What are you looking for?"
          />
        ) : null}

        {hasSearchTerm && results.isLoading ? (
          <ContentSkeleton rows={2} />
        ) : null}

        {hasSearchTerm && results.isError ? (
          <FeedbackState
            actionLabel="Retry"
            onAction={() => void results.refetch()}
            title="Couldn’t load search results."
            variant="error"
          />
        ) : null}

        {hasSearchTerm && !results.isLoading && !results.isError ? (
          <DiscoverResultsView results={results.data} />
        ) : null}
      </PageScrollView>
    </SafeAreaView>
  );
}

function DiscoverResultsView({
  results,
}: {
  results: DiscoverResults | undefined;
}) {
  const [filter, setFilter] = useState<ResultFilter>("people");
  const profiles = results?.profiles ?? [];
  const posts = results?.posts ?? [];
  const restaurants = results?.restaurants ?? [];
  const hasResults =
    profiles.length > 0 || posts.length > 0 || restaurants.length > 0;

  if (!hasResults) {
    return (
      <SearchState
        description="Try a different name, username, post phrase, or restaurant location."
        title="No results found"
      />
    );
  }

  return (
    <View className="gap-5">
      <View className="flex-row flex-wrap gap-2">
        {(["people", "posts", "restaurants"] as const).map((item) => (
          <Button
            key={item}
            size="sm"
            variant={filter === item ? "default" : "outline"}
            onPress={() => setFilter(item)}
          >
            <Text>{item.charAt(0).toUpperCase() + item.slice(1)}</Text>
          </Button>
        ))}
      </View>
      {filter === "people" && profiles.length > 0 ? (
        <ProfileResults profiles={profiles} />
      ) : null}
      {filter === "posts" && posts.length > 0 ? (
        <PostResults posts={posts} />
      ) : null}
      {filter === "restaurants" && restaurants.length > 0 ? (
        <RestaurantResults restaurants={restaurants} />
      ) : null}
    </View>
  );
}

function ProfileResults({ profiles }: { profiles: DiscoveryProfile[] }) {
  return (
    <ResultSection>
      {profiles.map((profile) => (
        <Link
          key={profile.username}
          href={routes.user(profile.username)}
          asChild
        >
          <Button
            className="gap-3 border border-border bg-card"
            size="content"
            variant="ghost"
          >
            <Avatar alt={`${profile.displayName}'s avatar`} className="size-9">
              {profile.avatarUrl ? (
                <AvatarImage source={{ uri: profile.avatarUrl }} />
              ) : null}
              <AvatarFallback>
                <Text variant="small">{getInitials(profile.displayName)}</Text>
              </AvatarFallback>
            </Avatar>
            <View className="min-w-0 flex-1 items-start gap-0.5">
              <Text className="truncate text-left font-semibold">
                {profile.displayName}
              </Text>
              <Text variant="muted" className="truncate text-left text-xs">
                @{profile.username}
              </Text>
            </View>
          </Button>
        </Link>
      ))}
    </ResultSection>
  );
}

function PostResults({ posts }: { posts: DiscoveryPost[] }) {
  return (
    <ResultSection>
      {posts.map((post) => (
        <Link key={post.id} href={routes.post(post.id)} asChild>
          <Button
            className="gap-3 border border-border bg-card"
            size="content"
            variant="ghost"
          >
            <View className="size-9 items-center justify-center rounded-md bg-accent">
              <Text className="text-xs font-semibold text-accent-foreground">
                {post.postType}
              </Text>
            </View>
            <View className="min-w-0 flex-1 items-start gap-0.5">
              <Text className="truncate text-left font-semibold">
                {post.title ?? post.body ?? "Restaurant rating"}
              </Text>
              <Text variant="muted" className="truncate text-left text-xs">
                {post.authorName}
              </Text>
            </View>
          </Button>
        </Link>
      ))}
    </ResultSection>
  );
}

function RestaurantResults({ restaurants }: { restaurants: Restaurant[] }) {
  return (
    <ResultSection>
      {restaurants.map((restaurant) => (
        <Link
          key={restaurant.id}
          href={routes.restaurant(restaurant.id)}
          asChild
        >
          <Button
            className="gap-3 border border-border bg-card"
            size="content"
            variant="ghost"
          >
            <View className="size-9 items-center justify-center rounded-md bg-accent">
              <Icon as={MapPin} className="size-5 text-accent-foreground" />
            </View>
            <View className="min-w-0 flex-1 items-start gap-0.5">
              <Text className="truncate text-left font-semibold">
                {restaurant.name}
              </Text>
              <Text variant="muted" className="truncate text-left text-xs">
                {restaurant.address_line_1}, {restaurant.locality}
              </Text>
            </View>
          </Button>
        </Link>
      ))}
    </ResultSection>
  );
}

function ResultSection({ children }: { children: React.ReactNode }) {
  return (
    <View className="gap-2">
      <View className="gap-2">{children}</View>
    </View>
  );
}

function SearchState({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return <FeedbackState description={description} title={title} />;
}

function getInitials(displayName: string) {
  return displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
