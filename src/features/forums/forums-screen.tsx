import { Image } from "expo-image";
import { Link } from "expo-router";
import { Users } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentSkeleton } from "@/components/ui/content-skeleton";
import { FeedbackState } from "@/components/ui/feedback-state";
import { Icon } from "@/components/ui/icon";
import { PageScrollView } from "@/components/ui/page-scroll-view";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { routes } from "@/lib/routes";
import { useForums } from "@/queries/forums";

export function ForumsScreen() {
  const forums = useForums();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["left", "right"]}>
      <PageScrollView contentContainerClassName="gap-6">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1 gap-1">
            <Text variant="h1" className="text-left">
              Forums
            </Text>
            <Text variant="muted">
              Public spaces for focused restaurant conversations.
            </Text>
          </View>
          <Link href={routes.createForum} asChild>
            <Button size="sm">
              <Text>New</Text>
            </Button>
          </Link>
        </View>

        {forums.isLoading ? <ContentSkeleton /> : null}
        {forums.isError ? (
          <FeedbackState
            actionLabel="Retry"
            onAction={() => void forums.refetch()}
            title="Couldn’t load forums."
            variant="error"
          />
        ) : null}
        {!forums.isLoading && !forums.isError && forums.data?.length === 0 ? (
          <FeedbackState
            description="Public forums will appear here as they are opened."
            title="No forums yet"
          />
        ) : null}
        {forums.data?.length ? (
          <View className="gap-4">
            {forums.data.map((forum) => (
              <Link key={forum.id} href={routes.forum(forum.id)} asChild>
                <Pressable
                  accessibilityLabel={`Open ${forum.name} forum`}
                  accessibilityRole="link"
                  className="w-full rounded-lg active:opacity-90"
                >
                  <Card className="w-full gap-0 overflow-hidden py-0">
                    {forum.coverImageUrl ? (
                      <Image
                        accessibilityLabel={`${forum.name} cover image`}
                        className="h-28 w-full bg-muted"
                        contentFit="cover"
                        source={forum.coverImageUrl}
                      />
                    ) : (
                      <ForumCoverFallback />
                    )}

                    <View className="min-h-28 gap-2 p-4">
                      <Text className="text-lg font-semibold leading-6">
                        {forum.name}
                      </Text>
                      <Text
                        className="text-sm leading-5"
                        numberOfLines={2}
                        variant="muted"
                      >
                        {forum.description?.trim() ||
                          "A public discussion forum."}
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between border-t border-border px-4 py-3">
                      <View className="flex-row items-center gap-1.5">
                        <Icon
                          as={Users}
                          className="size-4 text-muted-foreground"
                        />
                        <Text variant="muted" className="text-xs">
                          {forum.memberCount}{" "}
                          {forum.memberCount === 1 ? "member" : "members"}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-1.5">
                        <View className="size-1.5 rounded-full bg-muted-foreground" />
                        <Text variant="muted" className="text-xs">
                          Public
                        </Text>
                      </View>
                    </View>
                  </Card>
                </Pressable>
              </Link>
            ))}
          </View>
        ) : null}
      </PageScrollView>
    </SafeAreaView>
  );
}

function ForumCoverFallback() {
  return (
    <View className="h-28 overflow-hidden bg-selected">
      <View className="absolute -left-10 -top-14 size-32 rounded-full bg-primary/15" />
      <View className="absolute left-1/4 top-5 h-24 w-24 rotate-45 rounded-lg bg-primary/10" />
      <View className="absolute bottom-4 right-1/4 size-14 rounded-full bg-primary/15" />
      <View className="absolute -right-8 -top-8 size-28 rotate-12 rounded-lg bg-primary/10" />
    </View>
  );
}
