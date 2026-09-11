import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Link, router, useLocalSearchParams } from "expo-router";
import { ImagePlus, MapPin, Star, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

import type { Restaurant } from "@/api/restaurants";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { SearchInput } from "@/components/ui/search-input";
import { StickyActionFooter } from "@/components/ui/sticky-action-footer";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/hooks/use-theme";
import { selectionFeedback, successFeedback } from "@/lib/feedback";
import { routes } from "@/lib/routes";
import { useAuth } from "@/providers/auth-provider";
import { useRestaurant, useRestaurantSearch } from "@/queries/restaurants";
import {
  useCreateShareRating,
  useMyRestaurantRating,
  useUpdateShareRating,
} from "@/queries/shares";

const MAX_IMAGES = 3;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export function ShareComposerScreen() {
  const { user } = useAuth();
  const { restaurantId } = useLocalSearchParams<{ restaurantId?: string }>();
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [body, setBody] = useState("");
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [pickerError, setPickerError] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState(false);
  const restaurantFromRoute = useRestaurant(restaurantId ?? "");
  const results = useRestaurantSearch(search);
  const existingRating = useMyRestaurantRating(
    restaurant?.id ?? "",
    user?.id ?? "",
  );
  const createRating = useCreateShareRating();
  const updateRating = useUpdateShareRating(
    existingRating.data?.postId ?? "",
    restaurant?.id ?? "",
    user?.id ?? "",
  );
  const isUpdating = Boolean(existingRating.data);
  const isSaving = createRating.isPending || updateRating.isPending;
  const mutationError = createRating.error ?? updateRating.error;
  const canPublish = Boolean(user && restaurant && score && !isSaving);

  useEffect(() => {
    if (restaurant || !restaurantFromRoute.data) return;
    setRestaurant(restaurantFromRoute.data);
  }, [restaurant, restaurantFromRoute.data]);

  useEffect(() => {
    if (!restaurant || existingRating.isLoading) return;

    setScore(existingRating.data?.score ?? null);
    setBody(existingRating.data?.body ?? "");
  }, [existingRating.data, existingRating.isLoading, restaurant]);

  const selectRestaurant = (nextRestaurant: Restaurant) => {
    selectionFeedback();
    setRestaurant(nextRestaurant);
    setSearch("");
    setScore(null);
    setBody("");
    setImages([]);
    setPickerError(null);
  };

  const clearRestaurant = () => {
    setRestaurant(null);
    router.setParams({ restaurantId: undefined });
  };

  const pickImages = async () => {
    setPickerError(null);

    if (images.length >= MAX_IMAGES) {
      setPickerError("A restaurant rating can contain up to three images.");
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
        selectionLimit: MAX_IMAGES - images.length,
      });

      if (result.canceled) return;

      if (
        result.assets.some(
          (asset) => asset.fileSize && asset.fileSize > MAX_IMAGE_BYTES,
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
          .slice(0, MAX_IMAGES),
      );
    } catch {
      setPickerError("We couldn’t open your photo library. Please try again.");
    } finally {
      setIsPicking(false);
    }
  };

  const publish = async () => {
    if (!user || !restaurant || !score || !canPublish) return;

    try {
      const post = isUpdating
        ? await updateRating.mutateAsync({ body, score })
        : await createRating.mutateAsync({
            authorId: user.id,
            body,
            entityId: restaurant.id,
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
              Rate a restaurant
            </Text>
            <Text variant="muted" className="leading-5">
              Your rating becomes one public restaurant post. You can update it
              later.
            </Text>
          </View>

          <View className="gap-3 rounded-lg border border-border bg-card p-3 shadow-none">
            <Text variant="small">Restaurant</Text>
            {restaurant ? (
              <View className="flex-row items-center justify-between gap-3 rounded-md border border-primary/30 bg-primary/5 p-3">
                <View className="min-w-0 flex-1 gap-1">
                  <Text className="truncate font-medium">
                    {restaurant.name}
                  </Text>
                  <Text variant="muted" className="truncate text-xs">
                    {restaurant.address_line_1}, {restaurant.locality}
                  </Text>
                </View>
                <Button
                  disabled={isSaving}
                  size="sm"
                  variant="ghost"
                  onPress={clearRestaurant}
                >
                  <Text>Change</Text>
                </Button>
              </View>
            ) : (
              <>
                <SearchInput
                  accessibilityLabel="Search restaurants"
                  autoFocus
                  placeholder="Search by name or location"
                  value={search}
                  onChangeText={setSearch}
                />
                {results.isLoading ? (
                  <Text variant="muted">Searching…</Text>
                ) : null}
                {results.isError ? (
                  <Text variant="small" className="text-destructive">
                    {results.error.message}
                  </Text>
                ) : null}
                {results.data?.map((item) => (
                  <Button
                    key={item.id}
                    className="min-h-12 h-auto justify-start border border-border bg-card px-3 py-2"
                    variant="ghost"
                    onPress={() => selectRestaurant(item)}
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
                        {item.address_line_1}, {item.locality}
                      </Text>
                    </View>
                  </Button>
                ))}
                {search.trim().length >= 2 &&
                !results.isLoading &&
                results.data?.length === 0 ? (
                  <View className="gap-2 border-t border-border pt-3">
                    <Text variant="muted" className="text-sm">
                      Can’t find it?
                    </Text>
                    <Link href={routes.restaurantSearchForShare} asChild>
                      <Button
                        className="self-start"
                        size="sm"
                        variant="outline"
                      >
                        <Text>Add a restaurant</Text>
                      </Button>
                    </Link>
                  </View>
                ) : null}
              </>
            )}
          </View>

          {restaurant ? (
            <>
              <View className="gap-3 rounded-lg border border-border bg-card p-3 shadow-none">
                <View className="flex-row items-center justify-between">
                  <Text variant="small">Your rating</Text>
                  {existingRating.isLoading ? (
                    <Text variant="muted">Loading…</Text>
                  ) : null}
                </View>
                <View className="flex-row items-center gap-1">
                  {[1, 2, 3, 4, 5].map((value) => {
                    const selected = score !== null && value <= score;
                    return (
                      <Button
                        key={value}
                        accessibilityLabel={`${value} star${value === 1 ? "" : "s"}`}
                        className="size-10 rounded-md"
                        disabled={isSaving || existingRating.isLoading}
                        size="icon"
                        variant="ghost"
                        onPress={() => {
                          selectionFeedback();
                          setScore(value);
                        }}
                      >
                        <Star
                          color={selected ? theme.rating : theme.textSecondary}
                          fill={selected ? theme.rating : "transparent"}
                          size={25}
                          strokeWidth={2}
                        />
                      </Button>
                    );
                  })}
                  {score ? (
                    <Text className="ml-2 font-medium">{score}.0</Text>
                  ) : null}
                </View>
              </View>

              <View className="gap-3 rounded-lg border border-border bg-card p-3 shadow-none">
                <View className="flex-row items-center justify-between">
                  <Text variant="small">Review (optional)</Text>
                  <Text variant="muted">{body.length}/2000</Text>
                </View>
                <Textarea
                  accessibilityLabel="Restaurant review"
                  editable={!isSaving}
                  maxLength={2000}
                  placeholder="What did you like, or what should people know?"
                  value={body}
                  onChangeText={setBody}
                />
              </View>

              {!isUpdating ? (
                <View className="gap-3 rounded-lg border border-border bg-card p-3 shadow-none">
                  <View className="flex-row items-center justify-between">
                    <Text variant="small">Photos (optional)</Text>
                    <Text variant="muted">{images.length}/3</Text>
                  </View>
                  {images.length > 0 ? (
                    <View className="gap-3 sm:flex-row">
                      {images.map((image, index) => (
                        <View key={image.uri} className="relative flex-1">
                          <Image
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
                    disabled={
                      images.length >= MAX_IMAGES || isSaving || isPicking
                    }
                    variant="outline"
                    onPress={() => void pickImages()}
                  >
                    <Icon as={ImagePlus} />
                    <Text>
                      {isPicking
                        ? "Opening…"
                        : images.length
                          ? "Add more photos"
                          : "Add photos"}
                    </Text>
                  </Button>
                  {pickerError ? (
                    <Text variant="small" className="text-destructive">
                      {pickerError}
                    </Text>
                  ) : null}
                </View>
              ) : null}
            </>
          ) : null}

          {mutationError ? (
            <Text variant="small" className="text-destructive">
              {mutationError.message}
            </Text>
          ) : null}
        </ScrollView>
        <StickyActionFooter>
          <Button
            disabled={isSaving}
            variant="secondary"
            onPress={() => router.back()}
          >
            <Text>Cancel</Text>
          </Button>
          <Button
            disabled={!canPublish || existingRating.isLoading}
            onPress={() => void publish()}
          >
            <Text>
              {isSaving
                ? "Saving…"
                : isUpdating
                  ? "Update rating"
                  : "Publish rating"}
            </Text>
          </Button>
        </StickyActionFooter>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
