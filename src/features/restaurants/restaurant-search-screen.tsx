import { Link, router, Stack } from "expo-router";
import { Search } from "lucide-react-native";
import { useDeferredValue, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import type { Restaurant } from "@/api/restaurants";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { routes } from "@/lib/routes";
import {
  useCreateRestaurant,
  useRestaurantSearch,
} from "@/queries/restaurants";

export function RestaurantSearchScreen() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const search = useRestaurantSearch(deferredQuery);
  const hasSearchTerm = query.trim().length >= 2;
  const restaurants = search.data ?? [];
  const [isAddingRestaurant, setIsAddingRestaurant] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <Stack.Screen options={{ title: "Find a restaurant" }} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="mx-auto w-full max-w-3xl gap-4 px-3 py-4 sm:px-6"
      >
        <View className="gap-1">
          <Text variant="h1" className="text-left text-2xl">
            Find a restaurant
          </Text>
          <Text className="text-sm" variant="muted">
            Search existing restaurants before adding a new one.
          </Text>
        </View>

        <View className="flex-row items-center gap-2 rounded-lg border border-border bg-card px-3">
          <Icon as={Search} className="size-5 text-muted-foreground" />
          <Input
            accessibilityLabel="Search restaurants"
            autoCapitalize="words"
            className="h-11 flex-1 border-0 bg-transparent px-0 shadow-none"
            placeholder="Restaurant name or locality"
            returnKeyType="search"
            value={query}
            onChangeText={setQuery}
          />
        </View>

        {!hasSearchTerm ? (
          <SearchState
            description="Enter at least two characters to search by restaurant name, locality, or address."
            title="Search restaurants"
          />
        ) : null}

        {hasSearchTerm && search.isLoading ? (
          <View className="flex-row items-center gap-2 py-3">
            <ActivityIndicator />
            <Text variant="muted">Searching restaurants…</Text>
          </View>
        ) : null}

        {hasSearchTerm && search.isError ? (
          <View className="items-start gap-3 rounded-lg border border-destructive/40 bg-card p-3">
            <Text className="text-destructive" variant="small">
              {search.error.message}
            </Text>
            <Button
              size="sm"
              variant="outline"
              onPress={() => void search.refetch()}
            >
              <Text>Try again</Text>
            </Button>
          </View>
        ) : null}

        {hasSearchTerm && !search.isLoading && !search.isError ? (
          restaurants.length > 0 ? (
            <View className="gap-2">
              {restaurants.map((restaurant) => (
                <RestaurantResult key={restaurant.id} restaurant={restaurant} />
              ))}
            </View>
          ) : (
            <SearchState
              description="No existing restaurant matches that search. Check the name and locality before adding one."
              title="No restaurants found"
            />
          )
        ) : null}

        {hasSearchTerm &&
        !search.isLoading &&
        !search.isError &&
        restaurants.length === 0 ? (
          isAddingRestaurant ? (
            <AddRestaurantForm
              initialName={query}
              onCancel={() => setIsAddingRestaurant(false)}
            />
          ) : (
            <Button
              className="self-start rounded-md"
              onPress={() => setIsAddingRestaurant(true)}
            >
              <Text>Add restaurant</Text>
            </Button>
          )
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function AddRestaurantForm({
  initialName,
  onCancel,
}: {
  initialName: string;
  onCancel: () => void;
}) {
  const createRestaurant = useCreateRestaurant();
  const [name, setName] = useState(initialName.trim());
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [locality, setLocality] = useState("");
  const [administrativeArea, setAdministrativeArea] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const canSubmit =
    name.trim().length > 0 &&
    addressLine1.trim().length > 0 &&
    locality.trim().length > 0 &&
    !createRestaurant.isPending;

  const submit = async () => {
    if (!canSubmit) return;

    try {
      const restaurant = await createRestaurant.mutateAsync({
        address_line_1: addressLine1,
        address_line_2: addressLine2 || null,
        administrative_area: administrativeArea || null,
        country_code: countryCode || null,
        locality,
        name,
        postal_code: postalCode || null,
      });
      router.replace(routes.restaurant(restaurant.id));
    } catch {
      // The API error remains visible below and supports a corrected retry.
    }
  };

  return (
    <View className="gap-3 rounded-lg border border-border bg-card p-3">
      <View className="gap-1">
        <Text className="text-sm font-semibold">Add restaurant</Text>
        <Text className="text-xs leading-4" variant="muted">
          Only add it if the search above does not show a suitable match.
        </Text>
      </View>

      <Input
        accessibilityLabel="Restaurant name"
        className="h-10 rounded-md"
        editable={!createRestaurant.isPending}
        placeholder="Restaurant name"
        value={name}
        onChangeText={setName}
      />
      <Input
        accessibilityLabel="Address line 1"
        className="h-10 rounded-md"
        editable={!createRestaurant.isPending}
        placeholder="Street address"
        value={addressLine1}
        onChangeText={setAddressLine1}
      />
      <Input
        accessibilityLabel="Address line 2"
        className="h-10 rounded-md"
        editable={!createRestaurant.isPending}
        placeholder="Suite, floor, or landmark (optional)"
        value={addressLine2}
        onChangeText={setAddressLine2}
      />
      <View className="gap-2 sm:flex-row">
        <Input
          accessibilityLabel="Locality"
          className="h-10 flex-1 rounded-md"
          editable={!createRestaurant.isPending}
          placeholder="City or locality"
          value={locality}
          onChangeText={setLocality}
        />
        <Input
          accessibilityLabel="State or region"
          className="h-10 flex-1 rounded-md"
          editable={!createRestaurant.isPending}
          placeholder="State or region (optional)"
          value={administrativeArea}
          onChangeText={setAdministrativeArea}
        />
      </View>
      <View className="gap-2 sm:flex-row">
        <Input
          accessibilityLabel="Country code"
          autoCapitalize="characters"
          className="h-10 flex-1 rounded-md"
          editable={!createRestaurant.isPending}
          maxLength={2}
          placeholder="Country code"
          value={countryCode}
          onChangeText={setCountryCode}
        />
        <Input
          accessibilityLabel="Postal code"
          className="h-10 flex-1 rounded-md"
          editable={!createRestaurant.isPending}
          placeholder="Postal code (optional)"
          value={postalCode}
          onChangeText={setPostalCode}
        />
      </View>

      {createRestaurant.isError ? (
        <Text className="text-destructive" variant="small">
          {createRestaurant.error.message}
        </Text>
      ) : null}

      <View className="flex-row justify-end gap-2">
        <Button
          disabled={createRestaurant.isPending}
          size="sm"
          variant="ghost"
          onPress={onCancel}
        >
          <Text>Cancel</Text>
        </Button>
        <Button disabled={!canSubmit} size="sm" onPress={() => void submit()}>
          <Text>
            {createRestaurant.isPending ? "Adding…" : "Add restaurant"}
          </Text>
        </Button>
      </View>
    </View>
  );
}

function RestaurantResult({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link href={routes.restaurant(restaurant.id)} asChild>
      <Button
        className="h-auto w-full items-start justify-start rounded-lg border border-border bg-card px-3 py-3 shadow-none"
        variant="ghost"
      >
        <View className="min-w-0 flex-1 items-start gap-0.5">
          <Text className="text-sm font-semibold">{restaurant.name}</Text>
          <Text className="text-xs" variant="muted">
            {formatRestaurantLocation(restaurant)}
          </Text>
        </View>
      </Button>
    </Link>
  );
}

function SearchState({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <View className="gap-1 rounded-lg border border-border bg-card p-3">
      <Text className="text-sm font-semibold">{title}</Text>
      <Text className="text-sm leading-5" variant="muted">
        {description}
      </Text>
    </View>
  );
}

function formatRestaurantLocation(restaurant: Restaurant) {
  return [
    restaurant.address_line_1,
    restaurant.locality,
    restaurant.administrative_area,
  ]
    .filter(Boolean)
    .join(", ");
}
