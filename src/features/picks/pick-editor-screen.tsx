import { router, useLocalSearchParams } from "expo-router";
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react-native";
import { useDeferredValue, useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import type { Restaurant } from "@/api/restaurants";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { selectionFeedback, successFeedback } from "@/lib/feedback";
import { routes } from "@/lib/routes";
import { useAuth } from "@/providers/auth-provider";
import {
  useCreatePersonalPick,
  usePersonalPick,
  useUpdatePersonalPick,
} from "@/queries/picks";
import { useRestaurantSearch } from "@/queries/restaurants";

type DraftPickItem = {
  note: string;
  restaurant: Restaurant;
};

export function PickEditorScreen() {
  const { pickId } = useLocalSearchParams<{ pickId?: string }>();
  const { user } = useAuth();
  const pick = usePersonalPick(pickId ?? "");
  const createPick = useCreatePersonalPick(user?.id ?? "");
  const updatePick = useUpdatePersonalPick(pickId ?? "", user?.id ?? "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<DraftPickItem[]>([]);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const restaurantSearch = useRestaurantSearch(deferredSearch);
  const initializedPickId = useRef<string | null>(null);
  const isEditing = Boolean(pickId);
  const isSaving = createPick.isPending || updatePick.isPending;
  const mutationError = createPick.error ?? updatePick.error;
  const isOwner = !isEditing || pick.data?.author_id === user?.id;

  useEffect(() => {
    if (!pickId || !pick.data || initializedPickId.current === pickId) return;

    initializedPickId.current = pickId;
    setTitle(pick.data.title);
    setDescription(pick.data.description ?? "");
    setItems(
      pick.data.items.map((item) => ({
        note: item.note ?? "",
        restaurant: item.restaurant,
      })),
    );
  }, [pick.data, pickId]);

  const addRestaurant = (restaurant: Restaurant) => {
    if (items.some((item) => item.restaurant.id === restaurant.id)) return;

    selectionFeedback();
    setItems((current) => [...current, { note: "", restaurant }]);
    setSearch("");
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    selectionFeedback();
    setItems((current) => {
      const next = [...current];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const updateNote = (index: number, note: string) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, note } : item,
      ),
    );
  };

  const removeItem = (index: number) => {
    selectionFeedback();
    setItems((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const save = async () => {
    if (!user || !isOwner || isSaving) return;

    try {
      const input = {
        description,
        items: items.map((item) => ({
          entityId: item.restaurant.id,
          note: item.note,
        })),
        title,
      };
      const savedPick = isEditing
        ? await updatePick.mutateAsync(input)
        : await createPick.mutateAsync(input);

      successFeedback();
      router.replace(routes.pick(savedPick.id));
    } catch {
      // The corrected retry can reuse the complete draft above.
    }
  };

  if (isEditing && pick.isLoading) {
    return <LoadingState />;
  }

  if (isEditing && (pick.isError || !pick.data || !isOwner)) {
    return (
      <MessageState
        description={
          pick.isError
            ? pick.error.message
            : "This Pick is unavailable or belongs to another account."
        }
        title="Can’t edit this Pick"
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="mx-auto w-full max-w-2xl gap-4 px-3 py-4 sm:px-6"
      >
        <View className="gap-1">
          <Text variant="h1" className="text-left text-2xl">
            {isEditing ? "Edit Pick" : "Create a Pick"}
          </Text>
          <Text variant="muted" className="leading-5">
            Curate an ordered list of restaurants worth sharing.
          </Text>
        </View>

        <View className="gap-3 rounded-lg border border-border bg-card p-3 shadow-none">
          <Input
            accessibilityLabel="Pick title"
            editable={!isSaving}
            maxLength={100}
            placeholder="Pick title"
            value={title}
            onChangeText={setTitle}
          />
          <Input
            accessibilityLabel="Pick description"
            editable={!isSaving}
            maxLength={1000}
            multiline
            placeholder="A note about this collection (optional)"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View className="gap-2">
          <Text className="text-sm font-semibold">Restaurants</Text>
          <Input
            accessibilityLabel="Find a restaurant for this Pick"
            editable={!isSaving}
            placeholder="Search restaurants to add"
            value={search}
            onChangeText={setSearch}
          />
          {search.trim().length >= 2 && restaurantSearch.isLoading ? (
            <View className="flex-row items-center gap-2 py-1">
              <ActivityIndicator />
              <Text variant="muted">Searching restaurants…</Text>
            </View>
          ) : null}
          {restaurantSearch.isError ? (
            <Text className="text-destructive" variant="small">
              {restaurantSearch.error.message}
            </Text>
          ) : null}
          {restaurantSearch.data?.map((restaurant) => {
            const isAdded = items.some(
              (item) => item.restaurant.id === restaurant.id,
            );

            return (
              <Button
                key={restaurant.id}
                className="h-auto justify-start rounded-md border border-border px-3 py-2.5"
                disabled={isAdded || isSaving}
                variant="ghost"
                onPress={() => addRestaurant(restaurant)}
              >
                <Icon as={MapPin} className="text-primary" />
                <View className="min-w-0 flex-1 gap-0.5">
                  <Text className="truncate text-left font-medium">
                    {restaurant.name}
                  </Text>
                  <Text variant="muted" className="truncate text-left text-xs">
                    {restaurant.address_line_1}, {restaurant.locality}
                  </Text>
                </View>
                <Text className="text-xs text-primary">
                  {isAdded ? "Added" : "Add"}
                </Text>
              </Button>
            );
          })}
        </View>

        <View className="gap-2">
          <Text className="text-sm font-semibold">Your order</Text>
          {items.length === 0 ? (
            <View className="rounded-lg border border-dashed border-border px-3 py-4">
              <Text variant="muted">
                Add at least one restaurant to continue.
              </Text>
            </View>
          ) : null}
          {items.map((item, index) => (
            <View
              key={item.restaurant.id}
              className="gap-2 rounded-lg border border-border bg-card p-3 shadow-none"
            >
              <View className="flex-row items-start gap-2">
                <Text className="pt-0.5 text-sm font-semibold text-primary">
                  {index + 1}
                </Text>
                <View className="min-w-0 flex-1 gap-0.5">
                  <Text className="truncate font-medium">
                    {item.restaurant.name}
                  </Text>
                  <Text variant="muted" className="truncate text-xs">
                    {item.restaurant.locality}
                  </Text>
                </View>
                <Button
                  accessibilityLabel={`Move ${item.restaurant.name} up`}
                  disabled={index === 0 || isSaving}
                  size="icon"
                  variant="ghost"
                  onPress={() => moveItem(index, -1)}
                >
                  <Icon as={ChevronUp} />
                </Button>
                <Button
                  accessibilityLabel={`Move ${item.restaurant.name} down`}
                  disabled={index === items.length - 1 || isSaving}
                  size="icon"
                  variant="ghost"
                  onPress={() => moveItem(index, 1)}
                >
                  <Icon as={ChevronDown} />
                </Button>
                <Button
                  accessibilityLabel={`Remove ${item.restaurant.name}`}
                  disabled={isSaving}
                  size="icon"
                  variant="ghost"
                  onPress={() => removeItem(index)}
                >
                  <Icon as={Trash2} className="text-destructive" />
                </Button>
              </View>
              <Input
                accessibilityLabel={`Note for ${item.restaurant.name}`}
                editable={!isSaving}
                maxLength={500}
                placeholder="Why it belongs here (optional)"
                value={item.note}
                onChangeText={(note) => updateNote(index, note)}
              />
            </View>
          ))}
        </View>

        {mutationError ? (
          <Text className="text-destructive" variant="small">
            {mutationError.message}
          </Text>
        ) : null}

        <Button
          disabled={!title.trim() || items.length === 0 || isSaving}
          onPress={save}
        >
          <Icon as={Plus} />
          <Text>
            {isSaving ? "Saving…" : isEditing ? "Save Pick" : "Publish Pick"}
          </Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

function LoadingState() {
  return (
    <SafeAreaView
      className="flex-1 items-center justify-center gap-2 bg-background"
      edges={["bottom"]}
    >
      <ActivityIndicator />
      <Text variant="muted">Loading Pick…</Text>
    </SafeAreaView>
  );
}

function MessageState({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <SafeAreaView
      className="flex-1 items-center justify-center gap-2 bg-background px-6"
      edges={["bottom"]}
    >
      <Text variant="h2">{title}</Text>
      <Text variant="muted" className="text-center">
        {description}
      </Text>
      <Button variant="outline" onPress={() => router.back()}>
        <Text>Go back</Text>
      </Button>
    </SafeAreaView>
  );
}
