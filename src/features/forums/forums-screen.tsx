import { Image } from "expo-image";
import { Link } from "expo-router";
import { Users } from "lucide-react-native";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackState } from "@/components/ui/feedback-state";
import { Icon } from "@/components/ui/icon";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { routes } from "@/lib/routes";
import { useForums } from "@/queries/forums";

export function ForumsScreen() {
  const forums = useForums();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <ScrollView contentContainerClassName="mx-auto w-full max-w-3xl gap-4 px-3 py-4 sm:px-6">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1 gap-1">
            <Text variant="h1" className="text-left text-2xl">
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

        {forums.isLoading ? <LoadingState /> : null}
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
        {forums.data?.map((forum) => (
          <Link key={forum.id} href={routes.forum(forum.id)} asChild>
            <Card className="gap-0 overflow-hidden py-0">
              {forum.coverImageUrl ? (
                <Image
                  accessibilityLabel={`${forum.name} cover image`}
                  className="h-36 w-full bg-muted"
                  contentFit="cover"
                  source={forum.coverImageUrl}
                />
              ) : null}
              <CardHeader className="pt-3">
                <CardTitle>{forum.name}</CardTitle>
              </CardHeader>
              <CardContent className="gap-2 pb-3">
                <Text variant="muted">
                  {forum.description?.trim() || "A public discussion forum."}
                </Text>
                <View className="flex-row items-center gap-1">
                  <Icon as={Users} className="size-4 text-muted-foreground" />
                  <Text variant="muted" className="text-xs">
                    {forum.memberCount}{" "}
                    {forum.memberCount === 1 ? "member" : "members"}
                  </Text>
                </View>
              </CardContent>
            </Card>
          </Link>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function LoadingState() {
  return (
    <View className="items-center gap-2 py-10">
      <ActivityIndicator />
      <Text variant="muted">Loading forums…</Text>
    </View>
  );
}
