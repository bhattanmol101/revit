import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { successFeedback } from "@/lib/feedback";
import { routes } from "@/lib/routes";
import { useAuth } from "@/providers/auth-provider";
import { useCreateForum } from "@/queries/forums";

export function CreateForumScreen() {
  const { user } = useAuth();
  const createForum = useCreateForum();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const slug = slugFromName(name);
  const canSubmit = Boolean(
    user && name.trim() && slug.trim().length >= 3 && !createForum.isPending,
  );

  const submit = async () => {
    if (!user || !canSubmit) return;
    try {
      const forum = await createForum.mutateAsync({
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
        <Input
          accessibilityLabel="Forum description"
          className="min-h-24 items-start py-2"
          editable={!createForum.isPending}
          maxLength={1000}
          multiline
          placeholder="What is this forum for? (optional)"
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />
        <Input
          accessibilityLabel="Forum rules"
          className="min-h-24 items-start py-2"
          editable={!createForum.isPending}
          maxLength={2000}
          multiline
          placeholder="Rules (optional)"
          textAlignVertical="top"
          value={rules}
          onChangeText={setRules}
        />
        {createForum.isError ? (
          <Text className="text-destructive" variant="small">
            {createForum.error.message}
          </Text>
        ) : null}
        <View className="flex-row justify-end gap-2">
          <Button
            disabled={createForum.isPending}
            variant="ghost"
            onPress={() => router.back()}
          >
            <Text>Cancel</Text>
          </Button>
          <Button disabled={!canSubmit} onPress={() => void submit()}>
            <Text>{createForum.isPending ? "Creating…" : "Create forum"}</Text>
          </Button>
        </View>
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
