import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { ImagePlus, X } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { StickyActionFooter } from "@/components/ui/sticky-action-footer";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { successFeedback } from "@/lib/feedback";
import { routes } from "@/lib/routes";
import { useAuth } from "@/providers/auth-provider";
import { useCreateAskPost } from "@/queries/posts";

const MAX_IMAGES = 3;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export function AskComposerScreen() {
  const { user } = useAuth();
  const createPost = useCreateAskPost();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [pickerError, setPickerError] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState(false);
  const titleLength = title.trim().length;
  const bodyLength = body.length;
  const canPublish =
    Boolean(user) &&
    titleLength >= 1 &&
    titleLength <= 120 &&
    bodyLength <= 2000 &&
    !createPost.isPending;

  const pickImages = async () => {
    setPickerError(null);

    if (images.length >= MAX_IMAGES) {
      setPickerError("An Ask post can contain up to three images.");
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

      const remaining = MAX_IMAGES - images.length;
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
        mediaTypes: ["images"],
        orderedSelection: true,
        quality: 0.85,
        selectionLimit: remaining,
      });

      if (result.canceled) return;

      const oversized = result.assets.some(
        (asset) => asset.fileSize && asset.fileSize > MAX_IMAGE_BYTES,
      );

      if (oversized) {
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
          .slice(0, MAX_IMAGES),
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
      const post = await createPost.mutateAsync({
        authorId: user.id,
        body,
        images: images.map((image) => ({
          file: image.file,
          fileName: image.fileName,
          fileSize: image.fileSize,
          mimeType: image.mimeType,
          uri: image.uri,
        })),
        title,
      });

      successFeedback();
      router.replace(routes.post(post.id));
    } catch {
      // The mutation error is rendered below and remains available for retry.
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={[]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.select({ ios: "padding", default: undefined })}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="mx-auto w-full max-w-2xl gap-4 px-3 py-4 sm:px-6"
        >
          <View className="gap-2 py-1">
            <Text variant="h1" className="text-left text-2xl">
              Ask for ratings
            </Text>
            <Text variant="muted" className="leading-5">
              Ask one clear question. You don’t need to choose a restaurant or
              other item.
            </Text>
          </View>

          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text variant="small">Title</Text>
              <Text variant="muted">{title.length}/120</Text>
            </View>
            <Input
              accessibilityLabel="Ask title"
              autoFocus
              editable={!createPost.isPending}
              maxLength={120}
              placeholder="What would you like people to rate?"
              returnKeyType="next"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text variant="small">Details (optional)</Text>
              <Text variant="muted">{bodyLength}/2000</Text>
            </View>
            <Textarea
              accessibilityLabel="Ask details"
              editable={!createPost.isPending}
              maxLength={2000}
              placeholder="Add context that will help people answer."
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
                      className="h-32 w-full rounded-md bg-muted sm:h-36"
                      contentFit="cover"
                      source={image.uri}
                    />
                    <Button
                      accessibilityLabel={`Remove image ${index + 1}`}
                      className="absolute right-2 top-2 rounded-md bg-background/90"
                      disabled={createPost.isPending}
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
              disabled={
                images.length >= MAX_IMAGES || createPost.isPending || isPicking
              }
              variant="outline"
              onPress={() => void pickImages()}
            >
              <Icon as={ImagePlus} />
              <Text>
                {isPicking
                  ? "Opening…"
                  : images.length
                    ? "Add more images"
                    : "Add images"}
              </Text>
            </Button>

            {pickerError ? (
              <Text variant="small" className="text-destructive">
                {pickerError}
              </Text>
            ) : null}
          </View>

          {createPost.isError ? (
            <Text variant="small" className="text-destructive">
              {createPost.error.message}
            </Text>
          ) : null}
        </ScrollView>
        <StickyActionFooter>
          <Button
            disabled={createPost.isPending}
            variant="secondary"
            onPress={() => router.back()}
          >
            <Text>Cancel</Text>
          </Button>
          <Button disabled={!canPublish} onPress={() => void publish()}>
            <Text>{createPost.isPending ? "Publishing…" : "Publish Ask"}</Text>
          </Button>
        </StickyActionFooter>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
