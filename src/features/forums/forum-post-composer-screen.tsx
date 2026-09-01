import { router, useLocalSearchParams } from "expo-router";
import { useDeferredValue, useState } from "react";
import { ScrollView, View } from "react-native";
import type { Post } from "@/api/posts";
import type { Restaurant } from "@/api/restaurants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { successFeedback } from "@/lib/feedback";
import { routes } from "@/lib/routes";
import { useAuth } from "@/providers/auth-provider";
import {
  useCreateForumAskPost,
  useCreateForumSharePost,
} from "@/queries/posts";
import { useRestaurantSearch } from "@/queries/restaurants";

export function ForumPostComposerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [type, setType] = useState<"ASK" | "SHARE">("ASK");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [search, setSearch] = useState("");
  const results = useRestaurantSearch(useDeferredValue(search));
  const createAsk = useCreateForumAskPost(id);
  const createShare = useCreateForumSharePost(id);
  const isSaving = createAsk.isPending || createShare.isPending;
  const error = createAsk.error ?? createShare.error;
  const canPublish = Boolean(
    user && (type === "ASK" ? title.trim() : restaurant) && !isSaving,
  );

  const publish = async () => {
    if (!user || !canPublish) return;
    try {
      let post: Post;
      if (type === "ASK") {
        post = await createAsk.mutateAsync({
          authorId: user.id,
          body,
          forumId: id,
          title,
        });
      } else {
        if (!restaurant) return;
        post = await createShare.mutateAsync({
          authorId: user.id,
          body,
          entityId: restaurant.id,
          forumId: id,
        });
      }
      successFeedback();
      router.replace(routes.post(post.id));
    } catch {}
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="mx-auto w-full max-w-2xl gap-4 px-3 py-4 sm:px-6"
      >
        <View className="gap-1">
          <Text variant="h1" className="text-left text-2xl">
            New forum post
          </Text>
          <Text variant="muted">
            Posts stay inside this forum and never enter Home.
          </Text>
        </View>
        <View className="flex-row gap-2">
          <Button
            className="flex-1"
            variant={type === "ASK" ? "default" : "outline"}
            onPress={() => setType("ASK")}
          >
            <Text>Ask</Text>
          </Button>
          <Button
            className="flex-1"
            variant={type === "SHARE" ? "default" : "outline"}
            onPress={() => setType("SHARE")}
          >
            <Text>Share</Text>
          </Button>
        </View>
        {type === "ASK" ? (
          <Input
            accessibilityLabel="Ask title"
            editable={!isSaving}
            maxLength={120}
            placeholder="What would you like people to rate?"
            value={title}
            onChangeText={setTitle}
          />
        ) : (
          <View className="gap-2">
            {restaurant ? (
              <Button variant="outline" onPress={() => setRestaurant(null)}>
                <Text>{restaurant.name} · Change</Text>
              </Button>
            ) : (
              <>
                <Input
                  accessibilityLabel="Search restaurants"
                  placeholder="Search restaurant"
                  value={search}
                  onChangeText={setSearch}
                />
                {results.data?.map((item) => (
                  <Button
                    key={item.id}
                    className="justify-start"
                    variant="outline"
                    onPress={() => {
                      setRestaurant(item);
                      setSearch("");
                    }}
                  >
                    <Text>
                      {item.name} · {item.locality}
                    </Text>
                  </Button>
                ))}
              </>
            )}
          </View>
        )}
        <Input
          accessibilityLabel="Post details"
          className="min-h-28 items-start py-2"
          editable={!isSaving}
          maxLength={2000}
          multiline
          placeholder="Add context (optional)"
          textAlignVertical="top"
          value={body}
          onChangeText={setBody}
        />
        {type === "SHARE" ? (
          <Text variant="muted" className="text-xs">
            Forum Shares are discussion posts only; they do not change the
            restaurant’s global rating.
          </Text>
        ) : null}
        {error ? (
          <Text className="text-destructive" variant="small">
            {error.message}
          </Text>
        ) : null}
        <View className="flex-row justify-end gap-2">
          <Button
            disabled={isSaving}
            variant="ghost"
            onPress={() => router.back()}
          >
            <Text>Cancel</Text>
          </Button>
          <Button disabled={!canPublish} onPress={() => void publish()}>
            <Text>{isSaving ? "Publishing…" : "Publish"}</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
