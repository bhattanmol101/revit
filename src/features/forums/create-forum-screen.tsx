import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { ImagePlus, X } from "lucide-react-native";
import { useState } from "react";
import { Platform, ScrollView, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { StickyActionFooter } from "@/components/ui/sticky-action-footer";
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
    <SafeAreaView className="flex-1 bg-background" edges={[]}>
      <ScrollView contentContainerClassName="mx-auto w-full max-w-2xl gap-4 px-3 py-4 sm:px-6">
        <View className="gap-1">
          <Text variant="h1" className="text-left text-2xl">
            Create forum
          </Text>
          <Text variant="muted">You become the owner and first member.</Text>
        </View>
        <Input
          accessibilityLabel="Forum name"
          editable={!createForum.isPending}
          maxLength={100}
          placeholder="Forum name"
          value={name}
          onChangeText={setName}
        />
        <View className="gap-2">
          <Text variant="small">Cover image (optional)</Text>
          <Button
            className="self-start"
            variant="outline"
            onPress={() =>
              void (async () => {
                if (Platform.OS !== "web") {
                  const permission =
                    await ImagePicker.requestMediaLibraryPermissionsAsync();
                  if (!permission.granted) return;
                }
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ["images"],
                  quality: 0.85,
                });
                if (!result.canceled) setCover(result.assets[0]);
              })()
            }
          >
            <Icon as={ImagePlus} />
            <Text>{cover ? "Change cover image" : "Add cover image"}</Text>
          </Button>
          {cover ? (
            <View className="relative">
              <Image
                accessibilityLabel="Selected forum cover"
                className="h-36 w-full rounded-lg bg-muted"
                contentFit="cover"
                source={cover.uri}
              />
              <Button
                accessibilityLabel="Remove cover image"
                className="absolute right-2 top-2 bg-background/90"
                size="icon"
                variant="outline"
                onPress={() => setCover(null)}
              >
                <Icon as={X} />
              </Button>
            </View>
          ) : null}
        </View>
        <Textarea
          accessibilityLabel="Forum description"
          editable={!createForum.isPending}
          maxLength={1000}
          placeholder="What is this forum for? (optional)"
          value={description}
          onChangeText={setDescription}
        />
        <Textarea
          accessibilityLabel="Forum rules"
          editable={!createForum.isPending}
          maxLength={2000}
          placeholder="Rules (optional)"
          value={rules}
          onChangeText={setRules}
        />
        {createForum.isError ? (
          <Text className="text-destructive" variant="small">
            {createForum.error.message}
          </Text>
        ) : null}
      </ScrollView>
      <StickyActionFooter>
        <Button
          disabled={createForum.isPending}
          variant="secondary"
          onPress={() => router.back()}
        >
          <Text>Cancel</Text>
        </Button>
        <Button disabled={!canSubmit} onPress={() => void submit()}>
          <Text>{createForum.isPending ? "Creating…" : "Create forum"}</Text>
        </Button>
      </StickyActionFooter>
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
