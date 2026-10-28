import type * as ImagePicker from "expo-image-picker";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { ImagePickerCarousel } from "@/components/media/image-picker-carousel";
import { AppHeader } from "@/components/navigation/app-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { successFeedback } from "@/lib/feedback";
import { routes } from "@/lib/routes";
import { useAuth } from "@/providers/auth-provider";
import { useCreateAskPost } from "@/queries/posts";

const MAX_IMAGES = 3;

export function AskComposerScreen() {
  const { user } = useAuth();
  const createPost = useCreateAskPost();
  const [body, setBody] = useState("");
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const bodyLength = body.length;
  const canPublish =
    Boolean(user) &&
    body.trim().length >= 1 &&
    bodyLength <= 2000 &&
    !createPost.isPending;

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
              <ImagePickerCarousel
                images={images}
                onImagesChange={setImages}
                maxImages={MAX_IMAGES}
                disabled={createPost.isPending}
                addLabel="Add images"
              />
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
