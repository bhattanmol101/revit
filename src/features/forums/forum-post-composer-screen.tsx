import type * as ImagePicker from "expo-image-picker";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useDeferredValue, useState } from "react";
import { ScrollView, View } from "react-native";
import type { Post } from "@/api/posts";
import type { Entity } from "@/api/entities";
import { ImagePickerCarousel } from "@/components/media/image-picker-carousel";
import { AppHeader } from "@/components/navigation/app-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentSkeleton } from "@/components/ui/content-skeleton";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { SearchInput } from "@/components/ui/search-input";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/features/ratings/star-rating";
import { successFeedback } from "@/lib/feedback";
import type { LocalImage } from "@/lib/media/read-local-image";
import { routes } from "@/lib/routes";
import { useAuth } from "@/providers/auth-provider";
import { useEntityCategories, useEntitySearch } from "@/queries/entities";
import {
  useCreateForumAskPost,
  useCreateForumSharePost,
} from "@/queries/posts";

export function ForumPostComposerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [type, setType] = useState<"ASK" | "SHARE">("ASK");
  const [body, setBody] = useState("");
  const [entity, setEntity] = useState<Entity | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [categorySlug, setCategorySlug] = useState("place");
  const [search, setSearch] = useState("");
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const categories = useEntityCategories();
  const results = useEntitySearch(useDeferredValue(search), categorySlug);
  const createAsk = useCreateForumAskPost(id);
  const createShare = useCreateForumSharePost(id);
  const isSaving = createAsk.isPending || createShare.isPending;
  const error = createAsk.error ?? createShare.error;
  const canPublish = Boolean(
    user && (type === "SHARE" ? entity && score : body.trim()) && !isSaving,
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
          images: images.map(toLocalImage),
        });
      } else {
        if (!entity || !score) return;
        post = await createShare.mutateAsync({
          authorId: user.id,
          body,
          entityId: entity.id,
          forumId: id,
          images: images.map(toLocalImage),
          score,
        });
      }
      successFeedback();
      router.replace(routes.post(post.id));
    } catch {}
  };

  const closeComposer = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(routes.forum(id));
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <Stack.Screen
        options={{
          header: () => (
            <AppHeader
              leading="close"
              onLeadingPress={closeComposer}
              title="Forums"
              titleAlign="center"
              trailing={
                <Button
                  disabled={!canPublish}
                  size="sm"
                  onPress={() => void publish()}
                >
                  <Text>{isSaving ? "Publishing…" : "Publish"}</Text>
                </Button>
              }
            />
          ),
        }}
      />
      <ScrollView
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="w-full gap-6 pb-8 px-2 pt-4 md:mx-auto md:max-w-2xl md:pb-12 md:pt-6"
      >
        <Card className="gap-6 border-border bg-card p-4 pt-2 shadow-none">
          <View className="gap-2 py-1">
            <Text variant="h1" className="text-left">
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
          {type === "SHARE" ? (
            <View className="gap-2">
              <Text variant="small">Category</Text>
              {!entity ? (
                <View className="flex-row flex-wrap gap-2">
                  {(categories.data ?? []).map((category) => (
                    <Button
                      key={category.slug}
                      size="xs"
                      variant={
                        categorySlug === category.slug ? "default" : "outline"
                      }
                      onPress={() => {
                        setCategorySlug(category.slug);
                        setSearch("");
                      }}
                    >
                      <Text>{category.label}</Text>
                    </Button>
                  ))}
                </View>
              ) : null}
              <Text variant="small">Find</Text>
              {entity ? (
                <Button
                  variant="outline"
                  onPress={() => {
                    setEntity(null);
                    setScore(null);
                  }}
                >
                  <Text>{entity.name} · Change</Text>
                </Button>
              ) : (
                <>
                  <SearchInput
                    accessibilityLabel="Search finds"
                    placeholder="Search finds by name or location"
                    value={search}
                    onChangeText={setSearch}
                  />
                  {search.trim().length >= 2 && results.isLoading ? (
                    <ContentSkeleton rows={1} />
                  ) : null}
                  {results.isError ? (
                    <Text className="text-destructive" variant="small">
                      {results.error.message}
                    </Text>
                  ) : null}
                  {results.data?.map((item) => (
                    <Button
                      key={item.id}
                      className="border border-border bg-card"
                      size="content"
                      variant="outline"
                      onPress={() => {
                        setEntity(item);
                        setScore(null);
                        setSearch("");
                      }}
                    >
                      <Text>
                        {item.name} · {item.category.label}
                      </Text>
                    </Button>
                  ))}
                  {search.trim().length >= 2 &&
                  !results.isLoading &&
                  !results.isError &&
                  results.data?.length === 0 ? (
                    <Text variant="muted">
                      No finds in this category yet.
                    </Text>
                  ) : null}
                </>
              )}
              {entity ? (
                <View className="gap-2 pt-2">
                  <Text variant="small">Your rating</Text>
                  <View className="flex-row items-center gap-3">
                    <StarRating
                      value={score}
                      starSize={24}
                      gap={8}
                      onChange={setScore}
                    />
                    <Text variant="muted">
                      {score === null ? "Choose 1–5 stars" : `${score}/5`}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
          ) : null}
          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text variant="small">
                {type === "ASK" ? "Your question" : "Details (optional)"}
              </Text>
              <Text variant="muted">{body.length}/2000</Text>
            </View>
            <Textarea
              accessibilityLabel="Post details"
              editable={!isSaving}
              maxLength={2000}
              placeholder="Add context that will help people respond."
              value={body}
              onChangeText={setBody}
            />
          </View>
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text variant="small">Images (optional)</Text>
              <Text variant="muted">{images.length}/3</Text>
            </View>
            <ImagePickerCarousel
              images={images}
              onImagesChange={setImages}
              maxImages={3}
              disabled={isSaving}
              addLabel="Add images"
            />
          </View>
          {type === "SHARE" ? (
            <Text variant="muted" className="text-xs">
              This rating is shown in the forum and does not change the find’s
              global rating.
            </Text>
          ) : null}
          {error ? (
            <Text className="text-destructive" variant="small">
              {error.message}
            </Text>
          ) : null}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function toLocalImage(image: ImagePicker.ImagePickerAsset): LocalImage {
  return {
    file: image.file,
    fileName: image.fileName,
    fileSize: image.fileSize,
    mimeType: image.mimeType,
    uri: image.uri,
  };
}
