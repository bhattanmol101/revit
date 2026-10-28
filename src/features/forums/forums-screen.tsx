import { Link } from "expo-router";
import { Users } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Card } from "@/components/ui/card";
import { ContentSkeleton } from "@/components/ui/content-skeleton";
import { FeedbackState } from "@/components/ui/feedback-state";
import { Icon } from "@/components/ui/icon";
import { PageScrollView } from "@/components/ui/page-scroll-view";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { ForumCoverDisplay } from "@/features/forums/forum-cover-display";
import { routes } from "@/lib/routes";
import { useForums } from "@/queries/forums";

export function ForumsScreen() {
  const forums = useForums();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["left", "right"]}>
      <PageScrollView contentContainerClassName="gap-6">
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
          <View className="gap-2">
            {forums.data.map((forum) => (
              <Link key={forum.id} href={routes.forum(forum.id)} asChild>
                <Pressable
                  accessibilityLabel={`Open ${forum.name} forum`}
                  accessibilityRole="link"
                  className="w-full rounded-lg active:opacity-90"
                >
                  <Card className="w-full gap-0 overflow-hidden py-0">
                    <ForumCoverDisplay
                      forumId={forum.id}
                      forumName={forum.name}
                      imageUrl={forum.coverImageUrl}
                    />

                    <View className="gap-1 px-4 py-3">
                      <Text className="font-semibold">{forum.name}</Text>
                      <Text
                        className="text-xs leading-5"
                        numberOfLines={2}
                        variant="muted"
                      >
                        {forum.description?.trim() ||
                          "A public discussion forum."}
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between border-t border-border px-4 py-2">
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
