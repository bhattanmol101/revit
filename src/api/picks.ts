import { supabase } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";
import { normalizeApiError } from "./errors";
import { runApiRequest } from "./request";
import type { Entity } from "./entities";

export type PersonalPick = Tables<"picks">;

export type PersonalPickItem = Pick<
  Tables<"pick_items">,
  "created_at" | "entity_id" | "note" | "pick_id" | "position"
> & {
  entity: Entity;
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

export function deletePersonalPick(pickId: string): Promise<void> {
  return runApiRequest(async (signal) => {
    const { error } = await supabase
      .from("picks")
      .delete()
      .eq("id", pickId)
      .abortSignal(signal);

    if (error) {
      throw normalizeApiError(error, "We could not delete this Pick.");
    }
  });
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
          "pick_id, entity_id, position, note, created_at, entity:entities!pick_items_entity_id_fkey(id, category_id, name, description, image_url, address_line_1, address_line_2, locality, administrative_area, country_code, postal_code, category:entity_categories!inner(id, slug, label))",
        )
        .eq("pick_id", pick.id)
        .order("position", { ascending: true })
        .abortSignal(signal);

      if (itemsError) {
        throw normalizeApiError(
          itemsError,
          "We could not load the finds in this Pick.",
        );
      }

      return {
        ...pick,
        items: items as unknown as PersonalPickItem[],
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
    throw new Error("Add at least one find to your Pick.");
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

export type PickDirectoryItem = PersonalPick & {
  author: import("./follows").FollowProfile;
};

export async function getPicksFromFollowing(
  userId: string,
): Promise<PickDirectoryItem[]> {
  const { getFollowing } = await import("./follows");
  const authors: import("./follows").FollowProfile[] = [];
  let offset: number | undefined = 0;
  do {
    const page = await getFollowing(userId, offset);
    authors.push(...page.items);
    offset = page.nextOffset;
  } while (offset !== undefined);
  const groups = await Promise.all(
    authors.map(async (author) => {
      const picks: PersonalPick[] = [];
      for (let offset = 0; ; offset += 1000) {
        const page = await runApiRequest(
          async (signal) => {
            const { data, error } = await supabase
              .from("picks")
              .select(
                "id, author_id, pick_type, title, description, created_at, updated_at",
              )
              .eq("author_id", author.id)
              .eq("pick_type", "PERSONAL")
              .order("created_at", { ascending: false })
              .order("id", { ascending: true })
              .range(offset, offset + 999)
              .abortSignal(signal);
            if (error)
              throw normalizeApiError(error, "We could not load Picks.");
            return data;
          },
          { retries: 1 },
        );
        picks.push(...page);
        if (page.length < 1000) break;
      }
      return picks.map((pick) => ({ ...pick, author }));
    }),
  );
  return groups.flat().sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

export async function getFollowedPickIds(userId: string): Promise<string[]> {
  return runApiRequest(async (signal) => {
    const ids: string[] = [];
    for (let offset = 0; ; offset += 1000) {
      const { data, error } = await supabase
        .from("pick_follows")
        .select("pick_id")
        .eq("user_id", userId)
        .range(offset, offset + 999)
        .abortSignal(signal);
      if (error)
        throw normalizeApiError(error, "We could not load followed Picks.");
      ids.push(...data.map((item) => item.pick_id));
      if (data.length < 1000) return ids;
    }
  });
}

export async function setPickFollow(
  userId: string,
  pickId: string,
  follow: boolean,
): Promise<void> {
  return runApiRequest(async (signal) => {
    const request = follow
      ? supabase
          .from("pick_follows")
          .insert({ user_id: userId, pick_id: pickId })
      : supabase
          .from("pick_follows")
          .delete()
          .eq("user_id", userId)
          .eq("pick_id", pickId);
    const { error } = await request.abortSignal(signal);
    if (error)
      throw normalizeApiError(error, "We could not update the followed Pick.");
  });
}
