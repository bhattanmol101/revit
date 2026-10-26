import { Link } from "expo-router";
import { Bookmark } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { Card } from "@/components/ui/card";
import { ContentSkeleton } from "@/components/ui/content-skeleton";
import { FeedbackState } from "@/components/ui/feedback-state";
import { Icon } from "@/components/ui/icon";
import { PageScrollView } from "@/components/ui/page-scroll-view";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { routes } from "@/lib/routes";
import { useAuth } from "@/providers/auth-provider";
import { usePersonalPicksByAuthor } from "@/queries/picks";

export function PicksScreen() {
  const { profile } = useAuth();
  const picks = usePersonalPicksByAuthor(profile?.id ?? "");
  const items = picks.data ?? [];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["left", "right"]}>
      <PageScrollView contentContainerClassName="gap-6">
        {picks.isLoading ? <ContentSkeleton /> : null}
        {picks.isError ? (
          <FeedbackState
            actionLabel="Retry"
            onAction={() => void picks.refetch()}
            title="Couldn’t load Picks."
            variant="error"
          />
        ) : null}
        {!picks.isLoading && !picks.isError && items.length === 0 ? (
          <FeedbackState
            description="Create your first ordered restaurant list."
            title="No Picks yet"
          />
        ) : null}
        {items.map((pick) => (
          <Link key={pick.id} href={routes.pick(pick.id)} asChild>
            <Pressable
              accessibilityRole="link"
              className="w-full rounded-lg active:opacity-90"
            >
              <Card className="w-full flex-row gap-0 overflow-hidden py-0 shadow-none">
                <PickOrderRail />

                <View className="min-w-0 flex-1">
                  <View className="flex-1 justify-center gap-1 px-3 py-2 md:px-4">
                    <Text className="text-base font-semibold leading-5">
                      {pick.title}
                    </Text>
                    <Text
                      className="text-[13px] leading-4.5"
                      numberOfLines={2}
                      variant="muted"
                    >
                      {pick.description?.trim() || "Restaurant collection"}
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-between gap-3 border-t border-border px-3 py-1.5 md:px-4">
                    <View className="min-w-0 flex-row items-center gap-2">
                      <Icon
                        as={Bookmark}
                        className="size-4 text-muted-foreground"
                      />
                      <Text variant="muted" className="text-xs">
                        Personal Pick
                      </Text>
                    </View>
                    <Text
                      variant="muted"
                      className="shrink-0 text-xs"
                      numberOfLines={1}
                    >
                      {formatUpdatedAt(pick.updated_at)}
                    </Text>
                  </View>
                </View>
              </Card>
            </Pressable>
          </Link>
        ))}
      </PageScrollView>
    </SafeAreaView>
  );
}

function PickOrderRail() {
  return (
    <View className="w-10 items-center justify-center bg-primary py-2 md:w-16">
      {Array.from({ length: 3 }, (_, index) => {
        const position = index + 1;

        return (
          <View key={position} className="items-center">
            <View className="size-5 items-center justify-center rounded-full border-2 border-primary-foreground/40 bg-background/10">
              <Text className="text-[11px] font-semibold leading-none text-primary-foreground">
                {position}
              </Text>
            </View>
            {position < 3 ? (
              <View className="h-2 w-0.5 bg-primary-foreground/40" />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

function formatUpdatedAt(value: string) {
  const timestamp = new Date(value).getTime();
  const elapsedMs = Date.now() - timestamp;

  if (!Number.isFinite(timestamp) || elapsedMs < 0) return "Updated recently";

  const minutes = Math.floor(elapsedMs / 60_000);
  if (minutes < 1) return "Updated just now";
  if (minutes < 60) return `Updated ${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Updated ${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `Updated ${days}d ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `Updated ${weeks}w ago`;

  return `Updated ${new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year:
      new Date(value).getFullYear() === new Date().getFullYear()
        ? undefined
        : "numeric",
  }).format(new Date(value))}`;
}
