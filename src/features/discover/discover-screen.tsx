import { Link } from "expo-router";
import { MapPin, Search, UserRound } from "lucide-react-native";
import { useDeferredValue, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import type {
  DiscoverResults,
  DiscoveryPost,
  DiscoveryProfile,
} from "@/api/discover";
import type { Restaurant } from "@/api/restaurants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { routes } from "@/lib/routes";
import { useDiscover } from "@/queries/discover";

export function DiscoverScreen() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const results = useDiscover(deferredQuery);
  const hasSearchTerm = query.trim().length >= 2;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="mx-auto w-full max-w-3xl gap-4 px-3 py-4 sm:px-6"
      >
        <View className="gap-1">
          <Text variant="h1" className="text-left text-2xl">
            Discover
          </Text>
          <Text variant="muted">Find people, posts, and restaurants.</Text>
        </View>

        <View className="flex-row items-center gap-2 rounded-lg border border-border bg-card px-3">
          <Icon as={Search} className="size-5 text-muted-foreground" />
          <Input
            accessibilityLabel="Search Revit"
            autoCapitalize="none"
            autoCorrect={false}
            className="h-11 flex-1 border-0 bg-transparent px-0 shadow-none"
            placeholder="Search people, posts, or restaurants"
            returnKeyType="search"
            value={query}
            onChangeText={setQuery}
          />
        </View>

        {!hasSearchTerm ? (
          <SearchState
            description="Enter at least two characters to search across the available community content."
            title="What are you looking for?"
          />
        ) : null}

        {hasSearchTerm && results.isLoading ? (
          <View className="flex-row items-center gap-2 py-3">
            <ActivityIndicator />
            <Text variant="muted">Searching…</Text>
          </View>
        ) : null}

        {hasSearchTerm && results.isError ? (
          <View className="items-start gap-3 rounded-lg border border-destructive/40 bg-card p-3">
            <Text variant="small" className="text-destructive">
              {results.error.message}
            </Text>
            <Button
              size="sm"
              variant="outline"
              onPress={() => void results.refetch()}
            >
              <Text>Try again</Text>
            </Button>
          </View>
        ) : null}

        {hasSearchTerm && !results.isLoading && !results.isError ? (
          <DiscoverResultsView results={results.data} />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function DiscoverResultsView({
  results,
}: {
  results: DiscoverResults | undefined;
}) {
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
      {profiles.length > 0 ? <ProfileResults profiles={profiles} /> : null}
      {posts.length > 0 ? <PostResults posts={posts} /> : null}
      {restaurants.length > 0 ? (
        <RestaurantResults restaurants={restaurants} />
      ) : null}
    </View>
  );
}

function ProfileResults({ profiles }: { profiles: DiscoveryProfile[] }) {
  return (
    <ResultSection title="People">
      {profiles.map((profile) => (
        <Link
          key={profile.username}
          href={routes.user(profile.username)}
          asChild
        >
          <Button
            className="h-auto justify-start gap-3 rounded-md px-2 py-2"
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
    <ResultSection title="Posts">
      {posts.map((post) => (
        <Link key={post.id} href={routes.post(post.id)} asChild>
          <Button
            className="h-auto justify-start gap-3 rounded-md px-2 py-2"
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
    <ResultSection title="Restaurants">
      {restaurants.map((restaurant) => (
        <Link
          key={restaurant.id}
          href={routes.restaurant(restaurant.id)}
          asChild
        >
          <Button
            className="h-auto justify-start gap-3 rounded-md px-2 py-2"
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

function ResultSection({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-2">
        <Icon as={UserRound} className="size-4 text-muted-foreground" />
        <Text className="text-base font-semibold">{title}</Text>
      </View>
      <View className="gap-1 rounded-lg border border-border bg-card p-2 shadow-none">
        {children}
      </View>
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
  return (
    <View className="gap-1 rounded-lg border border-border bg-card p-3 shadow-none">
      <Text className="font-semibold">{title}</Text>
      <Text variant="muted" className="text-sm leading-5">
        {description}
      </Text>
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
