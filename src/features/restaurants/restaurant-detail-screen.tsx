import { router, Stack, useLocalSearchParams } from "expo-router";
import { MapPin, Star } from "lucide-react-native";
import { RefreshControl, ScrollView, View } from "react-native";
import { AppHeader } from "@/components/navigation/app-header";
import { Button } from "@/components/ui/button";
import { FeedbackState } from "@/components/ui/feedback-state";
import { Icon } from "@/components/ui/icon";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { SharePostCard } from "@/features/posts/share-post-card";
import { ProfileMessageScreen } from "@/features/profile/profile-state-screen";
import { useTheme } from "@/hooks/use-theme";
import { routes } from "@/lib/routes";
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

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(routes.discover);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <Stack.Screen
        options={{
          header: () => (
            <AppHeader showAccountActions title="Restaurants" onBack={goBack} />
          ),
        }}
      />
      {restaurant.isLoading ? <RestaurantDetailLoading /> : null}
      {restaurant.isError ? (
        <ProfileMessageScreen
          title="Restaurant unavailable"
          description="We couldn’t load this restaurant. Check your connection and try again."
          action={() => void restaurant.refetch()}
        />
      ) : null}
      {!restaurant.isLoading && !restaurant.isError && !restaurant.data ? (
        <ProfileMessageScreen
          title="Restaurant not found"
          description="This restaurant may have been removed or is no longer available."
        />
      ) : null}
      {restaurant.data ? (
        <RestaurantDetails restaurantId={restaurantId} />
      ) : null}
    </SafeAreaView>
  );
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
    <ScrollView
      contentContainerClassName="w-full gap-6 px-4 md:mx-auto md:max-w-3xl md:px-6 md:py-6"
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
          <Text variant="h1" className="text-left">
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
          <Icon as={Star} className="size-6 text-rating" fill={theme.rating} />
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
          <FeedbackState
            actionLabel="Retry"
            onAction={() => void posts.refetch()}
            title="Couldn’t load ratings."
            variant="error"
          />
        ) : null}
        {!posts.isLoading && !posts.isError && sharePosts.length === 0 ? (
          <FeedbackState
            description="Be the first to share your experience."
            title="No ratings yet"
          />
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
  );
}

function RestaurantDetailLoading() {
  return (
    <View className="w-full gap-6 px-4 md:mx-auto md:max-w-3xl md:px-6 md:py-6">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-60 w-full" />
    </View>
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
