import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { ImagePlus, X } from "lucide-react-native";
import { useDeferredValue, useState } from "react";
import { Platform, ScrollView, View } from "react-native";
import type { Post } from "@/api/posts";
import type { Restaurant } from "@/api/restaurants";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { successFeedback } from "@/lib/feedback";
import type { LocalImage } from "@/lib/media/read-local-image";
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
        <View className="gap-3 rounded-lg border border-border bg-card p-3 shadow-none">
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
                    className="h-32 w-full rounded-md bg-muted sm:h-36"
                    contentFit="cover"
                    source={image.uri}
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

function toLocalImage(image: ImagePicker.ImagePickerAsset): LocalImage {
  return {
    file: image.file,
    fileName: image.fileName,
    fileSize: image.fileSize,
    mimeType: image.mimeType,
    uri: image.uri,
  };
}
