import { supabase } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";
import { normalizeApiError } from "./errors";
import { runApiRequest } from "./request";
import type { Restaurant } from "./restaurants";

export type PersonalPick = Tables<"picks">;

export type PersonalPickItem = Pick<
  Tables<"pick_items">,
  "created_at" | "entity_id" | "note" | "pick_id" | "position"
> & {
  restaurant: Restaurant;
};

export type PersonalPickDetail = PersonalPick & {
  items: PersonalPickItem[];
};

export type SavePersonalPickInput = {
  description?: string;
  items: Array<{
    entityId: string;
    note?: string;
  }>;
  title: string;
};

export function createPersonalPick(
  input: SavePersonalPickInput,
): Promise<PersonalPick> {
  return savePersonalPick("create_personal_pick", input);
}

export function updatePersonalPick(
  pickId: string,
  input: SavePersonalPickInput,
): Promise<PersonalPick> {
  return savePersonalPick("update_personal_pick", input, pickId);
}

export function getPersonalPick(
  pickId: string,
): Promise<PersonalPickDetail | null> {
  return runApiRequest(
    async (signal) => {
      const { data: pick, error: pickError } = await supabase
        .from("picks")
        .select(
          "id, author_id, pick_type, title, description, created_at, updated_at",
        )
        .eq("id", pickId)
        .eq("pick_type", "PERSONAL")
        .abortSignal(signal)
        .maybeSingle();

      if (pickError) {
        throw normalizeApiError(pickError, "We could not load this Pick.");
      }

      if (!pick) return null;

      const { data: items, error: itemsError } = await supabase
        .from("pick_items")
        .select(
          "pick_id, entity_id, position, note, created_at, restaurant:entities!pick_items_entity_id_fkey(id, name, address_line_1, address_line_2, locality, administrative_area, country_code, postal_code, category:entity_categories!inner(slug))",
        )
        .eq("pick_id", pick.id)
        .eq("restaurant.category.slug", "restaurant")
        .order("position", { ascending: true })
        .abortSignal(signal);

      if (itemsError) {
        throw normalizeApiError(
          itemsError,
          "We could not load this Pick's restaurants.",
        );
      }

      return {
        ...pick,
        items: items.map(({ restaurant, ...item }) => {
          const { category: _category, ...restaurantDetails } = restaurant;
          return { ...item, restaurant: restaurantDetails };
        }),
      };
    },
    { retries: 1 },
  );
}

export function getPersonalPicksByAuthor(
  authorId: string,
): Promise<PersonalPick[]> {
  return runApiRequest(
    async (signal) => {
      const { data, error } = await supabase
        .from("picks")
        .select(
          "id, author_id, pick_type, title, description, created_at, updated_at",
        )
        .eq("author_id", authorId)
        .eq("pick_type", "PERSONAL")
        .order("created_at", { ascending: false })
        .order("id", { ascending: true })
        .abortSignal(signal);

      if (error) {
        throw normalizeApiError(error, "We could not load Picks.");
      }

      return data;
    },
    { retries: 1 },
  );
}

function savePersonalPick(
  operation: "create_personal_pick" | "update_personal_pick",
  input: SavePersonalPickInput,
  pickId?: string,
): Promise<PersonalPick> {
  const title = input.title.trim();
  const targetPickId = pickId ?? "";

  if (!title) {
    throw new Error("Give your Pick a title.");
  }

  if (input.items.length === 0) {
    throw new Error("Add at least one restaurant to your Pick.");
  }

  if (operation === "update_personal_pick" && !targetPickId) {
    throw new Error("Choose a Pick to update.");
  }

  return runApiRequest(async (signal) => {
    const payload = {
      p_description: input.description?.trim() || undefined,
      p_items: input.items.map((item, index) => ({
        entity_id: item.entityId,
        note: item.note?.trim() || undefined,
        position: index + 1,
      })),
      p_title: title,
    };
    const request =
      operation === "create_personal_pick"
        ? supabase.rpc("create_personal_pick", payload)
        : supabase.rpc("update_personal_pick", {
            ...payload,
            p_pick_id: targetPickId,
          });
    const { data, error } = await request.abortSignal(signal).single();

    if (error) {
      throw normalizeApiError(error, "We could not save this Pick.");
    }

    return data;
  });
}
