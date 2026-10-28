import type * as ImagePicker from "expo-image-picker";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { MapPin } from "lucide-react-native";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

import type { Entity } from "@/api/entities";
import { ImagePickerCarousel } from "@/components/media/image-picker-carousel";
import { ENTITY_IMAGE_PRESENTATION } from "@/components/media/image-presentation";
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
import { StarRating } from "@/features/ratings/star-rating";
import { selectionFeedback, successFeedback } from "@/lib/feedback";
import { readLocalImage } from "@/lib/media/read-local-image";
import { routes } from "@/lib/routes";
import { useAuth } from "@/providers/auth-provider";
import {
  useCreateEntity,
  useEntity,
  useEntityCategories,
  useEntitySearch,
} from "@/queries/entities";
import {
  useCreateShareRating,
  useMyEntityRating,
  useUpdateShareRating,
} from "@/queries/shares";

const MAX_IMAGES = 3;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export function ShareComposerScreen() {
  const { user } = useAuth();
  const { entityId } = useLocalSearchParams<{ entityId?: string }>();
  const [search, setSearch] = useState("");
  const [entity, setEntity] = useState<Entity | null>(null);
  const [categorySlug, setCategorySlug] = useState("place");
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [entityImage, setEntityImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [entityDraftError, setEntityDraftError] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [body, setBody] = useState("");
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const entityFromRoute = useEntity(entityId ?? "");
  const categories = useEntityCategories();
  const results = useEntitySearch(search, categorySlug);
  const createEntity = useCreateEntity();
  const existingRating = useMyEntityRating(entity?.id ?? "", user?.id ?? "");
  const createRating = useCreateShareRating();
  const updateRating = useUpdateShareRating(
    existingRating.data?.postId ?? "",
    entity?.id ?? "",
    user?.id ?? "",
  );
  const isUpdating = Boolean(existingRating.data);
  const isSaving = createRating.isPending || updateRating.isPending;
  const mutationError = createRating.error ?? updateRating.error;
  const canPublish = Boolean(user && entity && score && !isSaving);

  useEffect(() => {
    if (entity || !entityFromRoute.data) return;
    setEntity(entityFromRoute.data);
  }, [entity, entityFromRoute.data]);

  useEffect(() => {
    if (!entity || existingRating.isLoading) return;

    setScore(existingRating.data?.score ?? null);
    setBody(existingRating.data?.body ?? "");
  }, [existingRating.data, existingRating.isLoading, entity]);

  const selectEntity = (nextEntity: Entity) => {
    selectionFeedback();
    setEntity(nextEntity);
    setSearch("");
    setScore(null);
    setBody("");
    setImages([]);
  };

  const clearEntity = () => {
    setEntity(null);
    router.setParams({ entityId: undefined });
  };

  const closeComposer = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(routes.create);
  };

  const createEntityFromDraft = async () => {
    if (!user) return;
    setEntityDraftError(null);
    try {
      if (entityImage?.fileSize && entityImage.fileSize > MAX_IMAGE_BYTES) {
        throw new Error("The find image must be smaller than 10 MB.");
      }
      const image = entityImage
        ? await readLocalImage({
            file: entityImage.file,
            fileName: entityImage.fileName,
            fileSize: entityImage.fileSize,
            mimeType: entityImage.mimeType,
            uri: entityImage.uri,
          })
        : undefined;
      const created = await createEntity.mutateAsync({
        authorId: user.id,
        categorySlug,
        name: newName.trim() || search.trim(),
        description: newDescription,
        locality: newLocation,
        image,
      });
      selectEntity(created);
      setNewName("");
      setNewDescription("");
      setNewLocation("");
      setEntityImage(null);
    } catch (error) {
      setEntityDraftError(
        error instanceof Error
          ? error.message
          : "We could not prepare this find.",
      );
    }
  };

  const publish = async () => {
    if (!user || !entity || !score || !canPublish) return;

    try {
      const post = isUpdating
        ? await updateRating.mutateAsync({ body, score })
        : await createRating.mutateAsync({
            authorId: user.id,
            body,
            entityId: entity.id,
            images: images.map((image) => ({
              file: image.file,
              fileName: image.fileName,
              fileSize: image.fileSize,
              mimeType: image.mimeType,
              uri: image.uri,
            })),
            score,
          });

      successFeedback();
      router.replace(routes.post(post.id));
    } catch {
      // The API error is kept on-screen so the user can retry.
    }
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
                  disabled={!canPublish || existingRating.isLoading}
                  size="sm"
                  onPress={() => void publish()}
                >
                  <Text>
                    {isSaving ? "Saving…" : isUpdating ? "Update" : "Publish"}
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
          <Card className="gap-6 border-border bg-card p-4 pb-6 shadow-none">
            <View className="gap-2 py-1">
              <Text variant="h1" className="text-left">
                Rate anything
              </Text>
              <Text variant="muted" className="leading-5">
                Choose a category, find what you’re looking for, and share your
                rating.
              </Text>
            </View>

            <View className="gap-3">
              <Text variant="small">Category</Text>
              {!entity ? (
                <View className="flex-row flex-wrap gap-2">
                  {(categories.data ?? []).map((category) => (
                    <Button
                      key={category.id}
                      size="sm"
                      variant={
                        category.slug === categorySlug ? "default" : "outline"
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
                <View className="min-h-11 flex-row items-center gap-3 border-l-2 border-primary px-3 py-1.5">
                  <Icon as={MapPin} className="size-5 text-primary" />
                  <View className="min-w-0 flex-1 gap-0.5">
                    <Text className="truncate text-base font-semibold">
                      {entity.name}
                    </Text>
                    <Text variant="muted" className="truncate text-xs">
                      {[entity.category.label, entity.locality]
                        .filter(Boolean)
                        .join(" · ")}
                    </Text>
                  </View>
                  <Button
                    disabled={isSaving}
                    className="shrink-0"
                    size="xs"
                    variant="ghost"
                    onPress={clearEntity}
                  >
                    <Text className="text-sm text-primary">Change</Text>
                  </Button>
                </View>
              ) : (
                <>
                  <SearchInput
                    accessibilityLabel="Search finds"
                    autoFocus
                    placeholder="Search by name or location"
                    value={search}
                    onChangeText={setSearch}
                  />
                  {results.isLoading ? <ContentSkeleton rows={1} /> : null}
                  {results.isError ? (
                    <Text variant="small" className="text-destructive">
                      {results.error.message}
                    </Text>
                  ) : null}
                  {results.data?.map((item) => (
                    <Button
                      key={item.id}
                      className="border border-border bg-card"
                      size="content"
                      variant="ghost"
                      onPress={() => selectEntity(item)}
                    >
                      <Icon as={MapPin} className="text-primary" />
                      <View className="min-w-0 flex-1 gap-0.5">
                        <Text className="truncate text-left font-medium">
                          {item.name}
                        </Text>
                        <Text
                          variant="muted"
                          className="truncate text-left text-xs"
                        >
                          {[item.category.label, item.locality]
                            .filter(Boolean)
                            .join(" · ")}
                        </Text>
                      </View>
                    </Button>
                  ))}
                  {search.trim().length >= 2 &&
                  !results.isLoading &&
                  results.data?.length === 0 ? (
                    <View className="gap-3 border-t border-border pt-3">
                      <Text variant="muted" className="text-sm">
                        Can’t find it? Add it as a find
                      </Text>
                      <Input
                        accessibilityLabel="Find name"
                        placeholder="Name"
                        value={newName || search.trim()}
                        onChangeText={setNewName}
                      />
                      <Textarea
                        accessibilityLabel="Find description"
                        placeholder="Description (optional)"
                        value={newDescription}
                        onChangeText={setNewDescription}
                      />
                      <Input
                        accessibilityLabel="Find location"
                        placeholder="Location (optional)"
                        value={newLocation}
                        onChangeText={setNewLocation}
                      />
                      <ImagePickerCarousel
                        images={entityImage ? [entityImage] : []}
                        onImagesChange={(selected) =>
                          setEntityImage(selected[0] ?? null)
                        }
                        maxImages={1}
                        selectionLimit={1}
                        presentation={ENTITY_IMAGE_PRESENTATION}
                        replaceExisting
                        addLabel={entityImage ? "Change image" : "Add image"}
                        disabled={createEntity.isPending}
                      />
                      {entityDraftError ? (
                        <Text variant="small" className="text-destructive">
                          {entityDraftError}
                        </Text>
                      ) : null}
                      <Button
                        disabled={
                          !(newName.trim() || search.trim()) ||
                          createEntity.isPending
                        }
                        size="sm"
                        variant="outline"
                        onPress={() => void createEntityFromDraft()}
                      >
                        <Text>
                          {createEntity.isPending ? "Creating…" : "Add find"}
                        </Text>
                      </Button>
                      {createEntity.isError ? (
                        <Text variant="small" className="text-destructive">
                          {createEntity.error.message}
                        </Text>
                      ) : null}
                    </View>
                  ) : null}
                </>
              )}
            </View>

            {entity ? (
              <>
                <View className="gap-3 border-t border-border pt-6">
                  <View className="flex-row items-center justify-between">
                    <Text variant="small">Your rating</Text>
                    {existingRating.isLoading ? (
                      <Text variant="muted">Checking your rating…</Text>
                    ) : null}
                  </View>
                  <View className="flex-row items-center justify-between gap-3">
                    <View className="flex-row items-center gap-3">
                      <StarRating
                        value={score}
                        disabled={isSaving || existingRating.isLoading}
                        starSize={25}
                        gap={5}
                        onChange={(nextScore) => {
                          selectionFeedback();
                          setScore(nextScore);
                        }}
                      />
                      <Text className="text-sm font-medium" variant="muted">
                        {score === null ? "Not rated" : `${score} of 5`}
                      </Text>
                    </View>
                    {score !== null ? (
                      <Button
                        accessibilityLabel="Clear your rating"
                        className="shrink-0"
                        size="xs"
                        disabled={isSaving || existingRating.isLoading}
                        variant="link"
                        onPress={() => {
                          selectionFeedback();
                          setScore(null);
                        }}
                      >
                        <Text className="text-sm text-primary">
                          Clear rating
                        </Text>
                      </Button>
                    ) : null}
                  </View>
                </View>

                <View className="gap-3 border-t border-border pt-6">
                  <View className="flex-row items-center justify-between">
                    <Text variant="small">Review (optional)</Text>
                    <Text variant="muted">{body.length}/2000</Text>
                  </View>
                  <Textarea
                    accessibilityLabel="Review"
                    editable={!isSaving}
                    maxLength={2000}
                    placeholder="What did you like, or what should people know?"
                    value={body}
                    onChangeText={setBody}
                  />
                </View>

                {!isUpdating ? (
                  <View className="gap-3 border-t border-border pt-6">
                    <View className="flex-row items-center justify-between">
                      <Text variant="small">Photos (optional)</Text>
                      <Text variant="muted">{images.length}/3</Text>
                    </View>
                    <ImagePickerCarousel
                      images={images}
                      onImagesChange={setImages}
                      maxImages={MAX_IMAGES}
                      disabled={isSaving}
                      addLabel="Add photos"
                    />
                  </View>
                ) : null}
              </>
            ) : null}

            {mutationError ? (
              <Text variant="small" className="text-destructive">
                {mutationError.message}
              </Text>
            ) : null}
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
