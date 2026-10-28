import type * as ImagePicker from "expo-image-picker";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { ImagePickerCarousel } from "@/components/media/image-picker-carousel";
import { FORUM_COVER_PRESENTATION } from "@/components/media/image-presentation";
import { AppHeader } from "@/components/navigation/app-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { successFeedback } from "@/lib/feedback";
import { readLocalImage } from "@/lib/media/read-local-image";
import { routes } from "@/lib/routes";
import { useAuth } from "@/providers/auth-provider";
import { useCreateForum } from "@/queries/forums";

export function CreateForumScreen() {
  const { user } = useAuth();
  const createForum = useCreateForum();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const [cover, setCover] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const slug = slugFromName(name);
  const canSubmit = Boolean(
    user && name.trim() && slug.trim().length >= 3 && !createForum.isPending,
  );

  const submit = async () => {
    if (!user || !canSubmit) return;
    try {
      const forum = await createForum.mutateAsync({
        coverImage: cover
          ? await readLocalImage({
              file: cover.file,
              fileName: cover.fileName,
              mimeType: cover.mimeType,
              uri: cover.uri,
            })
          : undefined,
        description,
        name,
        ownerId: user.id,
        rules,
        slug,
      });
      successFeedback();
      router.replace(routes.forum(forum.id));
    } catch {}
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <Stack.Screen
        options={{
          header: () => (
            <AppHeader
              leading="close"
              onLeadingPress={() => router.replace(routes.forums)}
              title="Forums"
              titleAlign="center"
              trailing={
                <Button
                  disabled={!canSubmit}
                  size="sm"
                  onPress={() => void submit()}
                >
                  <Text>{createForum.isPending ? "Creating…" : "Create"}</Text>
                </Button>
              }
            />
          ),
        }}
      />
      <ScrollView
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="w-full gap-5 px-2 pb-8 pt-4 md:mx-auto md:max-w-2xl md:pb-12 md:pt-6"
      >
        <Card className="gap-5 border-border bg-card p-5 shadow-none md:p-6">
          <View className="gap-1.5 border-b border-border pb-4">
            <Text variant="h1" className="text-left">
              Create forum
            </Text>
            <Text variant="muted" className="leading-5">
              You become the owner and first member.
            </Text>
          </View>

          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text variant="small">Forum name</Text>
              <Text variant="muted">{name.length}/100</Text>
            </View>
            <Input
              accessibilityLabel="Forum name"
              editable={!createForum.isPending}
              maxLength={100}
              placeholder="Give your forum a clear name"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View className="gap-2.5">
            <View className="gap-0.5">
              <Text variant="small">Cover image (optional)</Text>
              <Text variant="muted">
                Give your forum a recognizable visual identity.
              </Text>
            </View>
            <ImagePickerCarousel
              images={cover ? [cover] : []}
              onImagesChange={(images) => setCover(images[0] ?? null)}
              maxImages={1}
              selectionLimit={1}
              presentation={FORUM_COVER_PRESENTATION}
              replaceExisting
              addLabel={cover ? "Change cover image" : "Add cover image"}
              disabled={createForum.isPending}
            />
          </View>

          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text variant="small">Details (optional)</Text>
              <Text variant="muted">{description.length}/1000</Text>
            </View>
            <Textarea
              accessibilityLabel="Forum description"
              editable={!createForum.isPending}
              maxLength={1000}
              placeholder="What is this forum for?"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text variant="small">Rules (optional)</Text>
              <Text variant="muted">{rules.length}/2000</Text>
            </View>
            <Textarea
              accessibilityLabel="Forum rules"
              editable={!createForum.isPending}
              maxLength={2000}
              placeholder="Add rules for members."
              value={rules}
              onChangeText={setRules}
            />
          </View>

          {createForum.isError ? (
            <Text className="text-destructive" variant="small">
              {createForum.error.message}
            </Text>
          ) : null}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function slugFromName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 63);
}
