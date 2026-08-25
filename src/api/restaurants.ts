import { supabase } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";

import { normalizeApiError } from "./errors";
import { runApiRequest } from "./request";

const RESTAURANT_SEARCH_LIMIT = 20;

export type Restaurant = Pick<
  Tables<"entities">,
  | "address_line_1"
  | "address_line_2"
  | "administrative_area"
  | "country_code"
  | "id"
  | "locality"
  | "name"
  | "postal_code"
>;

export type CreateRestaurantInput = Pick<
  Restaurant,
  | "address_line_1"
  | "address_line_2"
  | "administrative_area"
  | "country_code"
  | "locality"
  | "name"
  | "postal_code"
>;

export function createRestaurant(
  input: CreateRestaurantInput,
): Promise<Restaurant> {
  const name = input.name.trim();
  const addressLine1 = input.address_line_1.trim();
  const locality = input.locality.trim();

  if (!name || !addressLine1 || !locality) {
    throw new Error("Restaurant name, address, and locality are required.");
  }

  return runApiRequest(async (signal) => {
    const { data, error } = await supabase
      .rpc("create_restaurant_entity", {
        p_address_line_1: addressLine1,
        p_address_line_2: nullIfBlank(input.address_line_2),
        p_administrative_area: nullIfBlank(input.administrative_area),
        p_country_code: nullIfBlank(input.country_code)?.toUpperCase(),
        p_locality: locality,
        p_name: name,
        p_postal_code: nullIfBlank(input.postal_code),
      })
      .abortSignal(signal)
      .single();

    if (error) {
      throw normalizeApiError(error, "We could not add this restaurant.");
    }

    return data;
  });
}

export function getRestaurant(
  restaurantId: string,
): Promise<Restaurant | null> {
  return runApiRequest(
    async (signal) => {
      const { data, error } = await supabase
        .from("entities")
        .select(
          "id, name, address_line_1, address_line_2, locality, administrative_area, country_code, postal_code, category:entity_categories!inner(slug)",
        )
        .eq("id", restaurantId)
        .eq("category.slug", "restaurant")
        .abortSignal(signal)
        .maybeSingle();

      if (error) {
        throw normalizeApiError(error, "We could not load this restaurant.");
      }

      if (!data) return null;

      const { category: _category, ...restaurant } = data;
      return restaurant;
    },
    { retries: 1 },
  );
}

export function searchRestaurants(query: string): Promise<Restaurant[]> {
  const searchTerm = normalizeSearchTerm(query);

  if (!searchTerm) return Promise.resolve([]);

  const pattern = `%${escapeLikePattern(searchTerm)}%`;

  return runApiRequest(
    async (signal) => {
      const { data, error } = await supabase
        .from("entities")
        .select(
          "id, name, address_line_1, address_line_2, locality, administrative_area, country_code, postal_code, category:entity_categories!inner(slug)",
        )
        .eq("category.slug", "restaurant")
        .or(
          `normalized_name.ilike.${pattern},normalized_locality.ilike.${pattern},normalized_address.ilike.${pattern}`,
        )
        .order("normalized_name", { ascending: true })
        .order("normalized_locality", { ascending: true })
        .limit(RESTAURANT_SEARCH_LIMIT)
        .abortSignal(signal);

      if (error) {
        throw normalizeApiError(error, "We could not search restaurants.");
      }

      return data.map(({ category: _category, ...restaurant }) => restaurant);
    },
    { retries: 1 },
  );
}

function normalizeSearchTerm(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function escapeLikePattern(value: string) {
  return value.replace(/[\\%_]/g, "\\$&");
}

function nullIfBlank(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized || undefined;
}
