import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { ImagePlus, X } from "lucide-react-native";
import { useDeferredValue, useState } from "react";
import { Platform, ScrollView, View } from "react-native";
import type { Post } from "@/api/posts";
import type { Restaurant } from "@/api/restaurants";
import { AppHeader } from "@/components/navigation/app-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentSkeleton } from "@/components/ui/content-skeleton";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { SearchInput } from "@/components/ui/search-input";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { successFeedback } from "@/lib/feedback";
import type { LocalImage } from "@/lib/media/read-local-image";
import { routes } from "@/lib/routes";
import { useAuth } from "@/providers/auth-provider";
import {
  useCreateForumAskPost,
  useCreateForumSharePost,
} from "@/queries/posts";
import { useRestaurantSearch } from "@/queries/restaurants";

const MIN_POST_ASPECT_RATIO = 4 / 5;
const MAX_POST_ASPECT_RATIO = 16 / 9;

export function ForumPostComposerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [type, setType] = useState<"ASK" | "SHARE">("ASK");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [search, setSearch] = useState("");
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [pickerError, setPickerError] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState(false);
  const results = useRestaurantSearch(useDeferredValue(search));
  const createAsk = useCreateForumAskPost(id);
  const createShare = useCreateForumSharePost(id);
  const isSaving = createAsk.isPending || createShare.isPending;
  const error = createAsk.error ?? createShare.error;
  const canPublish = Boolean(
    user && (type === "ASK" ? title.trim() : restaurant) && !isSaving,
  );

  const pickImages = async () => {
    setPickerError(null);
    if (images.length >= 3) {
      setPickerError("A forum post can contain up to three images.");
      return;
    }

    setIsPicking(true);
    try {
      if (Platform.OS !== "web") {
        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          setPickerError("Photo access is needed to add an image.");
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
        mediaTypes: ["images"],
        orderedSelection: true,
        quality: 0.85,
        selectionLimit: 3 - images.length,
      });
      if (result.canceled) return;
      if (
        result.assets.some(
          (asset) => asset.fileSize && asset.fileSize > 10 * 1024 * 1024,
        )
      ) {
        setPickerError("Each image must be smaller than 10 MB.");
        return;
      }
      setImages((current) =>
        [...current, ...result.assets]
          .filter(
            (asset, index, all) =>
              all.findIndex((candidate) => candidate.uri === asset.uri) ===
              index,
          )
          .slice(0, 3),
      );
    } catch {
      setPickerError("We couldn’t open your photo library. Please try again.");
    } finally {
      setIsPicking(false);
    }
  };

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
          title,
        });
      } else {
        if (!restaurant) return;
        post = await createShare.mutateAsync({
          authorId: user.id,
          body,
          entityId: restaurant.id,
          forumId: id,
          images: images.map(toLocalImage),
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
        contentContainerClassName="w-full gap-6 px-6 pb-8 pt-4 md:mx-auto md:max-w-2xl md:pb-12 md:pt-6"
      >
        <Card className="gap-6 border-border bg-card p-6 shadow-none">
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
          {type === "ASK" ? (
            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text variant="small">Title</Text>
                <Text variant="muted">{title.length}/120</Text>
              </View>
              <Input
                accessibilityLabel="Ask title"
                editable={!isSaving}
                maxLength={120}
                placeholder="What would you like people to rate?"
                value={title}
                onChangeText={setTitle}
              />
            </View>
          ) : (
            <View className="gap-2">
              <Text variant="small">Restaurant</Text>
              {restaurant ? (
                <Button variant="outline" onPress={() => setRestaurant(null)}>
                  <Text>{restaurant.name} · Change</Text>
                </Button>
              ) : (
                <>
                  <SearchInput
                    accessibilityLabel="Search restaurants"
                    placeholder="Search restaurant"
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
                        setRestaurant(item);
                        setSearch("");
                      }}
                    >
                      <Text>
                        {item.name} · {item.locality}
                      </Text>
                    </Button>
                  ))}
                  {search.trim().length >= 2 &&
                  !results.isLoading &&
                  !results.isError &&
                  results.data?.length === 0 ? (
                    <Text variant="muted">No restaurants found.</Text>
                  ) : null}
                </>
              )}
            </View>
          )}
          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text variant="small">Details (optional)</Text>
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
            {images.length > 0 ? (
              <View className="gap-3 sm:flex-row">
                {images.map((image, index) => (
                  <View key={image.uri} className="relative flex-1">
                    <Image
                      accessibilityLabel={`Selected image ${index + 1}`}
                      className="w-full rounded-md bg-muted"
                      contentFit="contain"
                      source={image.uri}
                      style={{
                        aspectRatio: getPostPreviewAspectRatio(image),
                        width: "100%",
                      }}
                    />
                    <Button
                      accessibilityLabel={`Remove image ${index + 1}`}
                      className="absolute right-2 top-2 rounded-md bg-background/90"
                      disabled={isSaving}
                      size="icon"
                      variant="outline"
                      onPress={() =>
                        setImages((current) =>
                          current.filter(
                            (candidate) => candidate.uri !== image.uri,
                          ),
                        )
                      }
                    >
                      <Icon as={X} />
                    </Button>
                  </View>
                ))}
              </View>
            ) : null}
            <Button
              className="self-start"
              disabled={images.length >= 3 || isSaving || isPicking}
              variant="outline"
              onPress={() => void pickImages()}
            >
              <Icon as={ImagePlus} />
              <Text>{isPicking ? "Opening library…" : "Add images"}</Text>
            </Button>
            {pickerError ? (
              <Text className="text-destructive" variant="small">
                {pickerError}
              </Text>
            ) : null}
          </View>
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

function getPostPreviewAspectRatio(image: ImagePicker.ImagePickerAsset) {
  const naturalRatio =
    image.width && image.height ? image.width / image.height : 1;
  return Math.min(
    MAX_POST_ASPECT_RATIO,
    Math.max(MIN_POST_ASPECT_RATIO, naturalRatio),
  );
}
