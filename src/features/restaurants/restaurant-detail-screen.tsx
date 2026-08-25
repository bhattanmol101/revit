import { Stack, useLocalSearchParams } from "expo-router";
import { MapPin, Star } from "lucide-react-native";
import { RefreshControl, ScrollView, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { SharePostCard } from "@/features/posts/share-post-card";
import { ProfileMessageScreen } from "@/features/profile/profile-state-screen";
import { useTheme } from "@/hooks/use-theme";
import { useRestaurant } from "@/queries/restaurants";
import {
  useRestaurantRatingSummary,
  useSharePostsByRestaurant,
} from "@/queries/shares";

export function RestaurantDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const restaurantId = Array.isArray(params.id)
    ? params.id[0]
    : (params.id ?? "");
  const restaurant = useRestaurant(restaurantId);

  if (restaurant.isLoading) return <RestaurantDetailLoading />;

  if (restaurant.isError) {
    return (
      <ProfileMessageScreen
        title="Restaurant unavailable"
        description="We couldn’t load this restaurant. Check your connection and try again."
        action={() => void restaurant.refetch()}
      />
    );
  }

  if (!restaurant.data) {
    return (
      <ProfileMessageScreen
        title="Restaurant not found"
        description="This restaurant may have been removed or is no longer available."
      />
    );
  }

  return <RestaurantDetails restaurantId={restaurantId} />;
}

function RestaurantDetails({ restaurantId }: { restaurantId: string }) {
  const restaurant = useRestaurant(restaurantId);
  const summary = useRestaurantRatingSummary(restaurantId);
  const posts = useSharePostsByRestaurant(restaurantId);
  const theme = useTheme();
  const sharePosts = posts.data?.pages.flatMap((page) => page.items) ?? [];
  const restaurantData = restaurant.data;

  if (!restaurantData) return null;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <Stack.Screen options={{ title: restaurantData.name }} />
      <ScrollView
        contentContainerClassName="mx-auto w-full max-w-3xl gap-4 px-3 py-4 sm:px-6"
        refreshControl={
          <RefreshControl
            refreshing={
              restaurant.isRefetching ||
              summary.isRefetching ||
              posts.isRefetching
            }
            onRefresh={() =>
              void Promise.all([
                restaurant.refetch(),
                summary.refetch(),
                posts.refetch(),
              ])
            }
          />
        }
      >
        <View className="gap-3 rounded-lg border border-border bg-card p-3 shadow-none">
          <View className="gap-1">
            <Text variant="h1" className="text-left text-2xl">
              {restaurantData.name}
            </Text>
            <View className="flex-row items-center gap-1.5">
              <Icon as={MapPin} className="size-4 text-muted-foreground" />
              <Text variant="muted" className="text-sm">
                {formatRestaurantLocation(restaurantData)}
              </Text>
            </View>
          </View>

          <View className="flex-row items-end gap-2 border-t border-border pt-3">
            <Icon
              as={Star}
              className="size-6 text-rating"
              fill={theme.rating}
            />
            <Text className="text-2xl font-semibold">
              {summary.isLoading || summary.isError
                ? "—"
                : (summary.data?.averageScore?.toFixed(1) ?? "—")}
            </Text>
            <Text variant="muted" className="pb-0.5 text-sm">
              {summary.isLoading || summary.isError
                ? "ratings"
                : `${summary.data?.ratingCount ?? 0} ${(summary.data?.ratingCount ?? 0) === 1 ? "rating" : "ratings"}`}
            </Text>
          </View>
          {summary.isError ? (
            <Text variant="small" className="text-destructive">
              {summary.error.message}
            </Text>
          ) : null}
        </View>

        <View className="gap-3">
          <Text className="text-lg font-semibold">Ratings</Text>

          {posts.isLoading ? <RestaurantPostsLoading /> : null}
          {posts.isError && sharePosts.length === 0 ? (
            <View className="items-start gap-3 rounded-lg border border-border bg-card p-3">
              <Text className="font-medium">Ratings could not be loaded.</Text>
              <Button
                size="sm"
                variant="outline"
                onPress={() => void posts.refetch()}
              >
                <Text>Try again</Text>
              </Button>
            </View>
          ) : null}
          {!posts.isLoading && !posts.isError && sharePosts.length === 0 ? (
            <View className="rounded-lg border border-dashed border-border p-3">
              <Text className="font-medium">No ratings yet.</Text>
              <Text variant="muted">
                Be the first to share your experience.
              </Text>
            </View>
          ) : null}
          {sharePosts.map((post) => (
            <SharePostCard
              key={post.id}
              post={post}
              restaurant={restaurantData}
            />
          ))}
          {posts.hasNextPage ? (
            <Button
              disabled={posts.isFetchingNextPage}
              variant="outline"
              onPress={() => void posts.fetchNextPage()}
            >
              <Text>
                {posts.isFetchingNextPage ? "Loading…" : "Load more ratings"}
              </Text>
            </Button>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function RestaurantDetailLoading() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <View className="mx-auto w-full max-w-3xl gap-4 px-3 py-4 sm:px-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-60 w-full" />
      </View>
    </SafeAreaView>
  );
}

function RestaurantPostsLoading() {
  return (
    <View className="gap-3">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
    </View>
  );
}

function formatRestaurantLocation(restaurant: {
  address_line_1: string;
  administrative_area: string | null;
  locality: string;
}) {
  return [
    restaurant.address_line_1,
    restaurant.locality,
    restaurant.administrative_area,
  ]
    .filter(Boolean)
    .join(", ");
}
