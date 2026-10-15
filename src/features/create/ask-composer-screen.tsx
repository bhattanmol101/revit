import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, Stack } from "expo-router";
import { ImagePlus, X } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { AppHeader } from "@/components/navigation/app-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { successFeedback } from "@/lib/feedback";
import { routes } from "@/lib/routes";
import { useAuth } from "@/providers/auth-provider";
import { useCreateAskPost } from "@/queries/posts";

const MAX_IMAGES = 3;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MIN_POST_ASPECT_RATIO = 4 / 5;
const MAX_POST_ASPECT_RATIO = 16 / 9;

export function AskComposerScreen() {
  const { user } = useAuth();
  const createPost = useCreateAskPost();
  const [body, setBody] = useState("");
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [pickerError, setPickerError] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState(false);
  const bodyLength = body.length;
  const canPublish =
    Boolean(user) &&
    body.trim().length >= 1 &&
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
      });

      successFeedback();
      router.replace(routes.post(post.id));
    } catch {
      // The mutation error is rendered below and remains available for retry.
    }
  };

  const closeComposer = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(routes.create);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <Stack.Screen
        options={{
          header: () => (
            <AppHeader
              leading="close"
              onLeadingPress={closeComposer}
              title="Create post"
              titleAlign="center"
              trailing={
                <Button
                  disabled={!canPublish}
                  size="sm"
                  onPress={() => void publish()}
                >
                  <Text>
                    {createPost.isPending ? "Publishing…" : "Publish"}
                  </Text>
                </Button>
              }
            />
          ),
        }}
      />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.select({ ios: "padding", default: undefined })}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="w-full gap-6 px-2 pb-8 pt-4 md:mx-auto md:max-w-2xl md:px-6 md:pb-12 md:pt-6"
        >
          <Card className="gap-6 border-border bg-card pt-4 pb-6 px-4 shadow-none">
            <View className="gap-2 py-1">
              <Text variant="h1" className="text-left">
                Ask your circle.
              </Text>
              <Text variant="muted" className="leading-5">
                A little context. Better opinions.
              </Text>
            </View>

            <View className="flex-row items-center gap-3">
              <Avatar
                alt={`${user?.email ?? "Your"} avatar`}
                className="size-9"
              >
                <AvatarFallback>
                  <Text variant="small">
                    {(user?.email?.[0] ?? "Y").toUpperCase()}
                  </Text>
                </AvatarFallback>
              </Avatar>
              <View className="gap-0.5">
                <Text className="text-sm font-semibold">
                  {user?.email?.split("@")[0] ?? "You"}
                </Text>
                <Text variant="muted">New question</Text>
              </View>
            </View>

            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text variant="small">Your question</Text>
                <Text variant="muted">{bodyLength}/2000</Text>
              </View>
              <Textarea
                accessibilityLabel="Ask details"
                editable={!createPost.isPending}
                maxLength={2000}
                placeholder="What would you like to ask your circle?"
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
                <View className="gap-3">
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
                  images.length >= MAX_IMAGES ||
                  createPost.isPending ||
                  isPicking
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
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function getPostPreviewAspectRatio(image: ImagePicker.ImagePickerAsset) {
  const naturalRatio =
    image.width && image.height ? image.width / image.height : 1;
  return Math.min(
    MAX_POST_ASPECT_RATIO,
    Math.max(MIN_POST_ASPECT_RATIO, naturalRatio),
  );
}
