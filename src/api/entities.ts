import { supabase } from "@/lib/supabase/client";
import { randomUUID } from "expo-crypto";
import type { AskImageUpload } from "@/api/posts";
import type { Tables } from "@/lib/supabase/database.types";

import { normalizeApiError } from "./errors";
import { runApiRequest } from "./request";

const ENTITY_SEARCH_LIMIT = 20;

export type EntityCategory = Pick<
  Tables<"entity_categories">,
  "id" | "label" | "slug"
>;
export const ENTITY_CATEGORIES = [
  { slug: "book", label: "Books" },
  { slug: "movie", label: "Movies" },
  { slug: "product", label: "Products" },
  { slug: "place", label: "Places" },
  { slug: "service", label: "Services" },
] as const;
export type Entity = Pick<
  Tables<"entities">,
  | "address_line_1"
  | "address_line_2"
  | "administrative_area"
  | "category_id"
  | "country_code"
  | "created_by"
  | "description"
  | "id"
  | "image_url"
  | "locality"
  | "name"
  | "postal_code"
> & { category: EntityCategory };

export type CreateEntityInput = {
  authorId: string;
  address_line_1?: string | null;
  address_line_2?: string | null;
  administrative_area?: string | null;
  categorySlug: string;
  country_code?: string | null;
  description?: string | null;
  image?: AskImageUpload;
  locality?: string | null;
  name: string;
  postal_code?: string | null;
};

const ENTITY_SELECT =
  "id, created_by, category_id, name, description, image_url, address_line_1, address_line_2, locality, administrative_area, country_code, postal_code, category:entity_categories!inner(id, slug, label)";

export function getEntityCategories(): Promise<EntityCategory[]> {
  return runApiRequest(
    async (signal) => {
      const { data, error } = await supabase
        .from("entity_categories")
        .select("id, slug, label")
        .order("label", { ascending: true })
        .abortSignal(signal);
      if (error)
        throw normalizeApiError(error, "We could not load categories.");
      return data;
    },
    { retries: 1 },
  );
}

export function createEntity(input: CreateEntityInput): Promise<Entity> {
  const name = input.name.trim();
  if (!name) throw new Error("A find name is required.");
  if (
    input.image &&
    (input.image.data.byteLength === 0 ||
      input.image.data.byteLength > 10 * 1024 * 1024)
  ) {
    throw new Error("The find image must be smaller than 10 MB.");
  }
  return runApiRequest(async (signal) => {
    let uploadedPath: string | undefined;
    let imageUrl: string | undefined;
    if (input.image) {
      uploadedPath = `${input.authorId}/${randomUUID()}.${input.image.extension}`;
      const { error: uploadError } = await supabase.storage
        .from("entity-images")
        .upload(uploadedPath, input.image.data, {
          cacheControl: "31536000",
          contentType: input.image.contentType,
          upsert: false,
        });
      if (uploadError)
        throw normalizeApiError(
          uploadError,
          "We could not upload the find image.",
        );
      imageUrl = supabase.storage
        .from("entity-images")
        .getPublicUrl(uploadedPath).data.publicUrl;
    }

    try {
      const { data, error } = await supabase
        .rpc("create_entity", {
          p_category_slug: input.categorySlug,
          p_name: name,
          p_description: nullIfBlank(input.description),
          p_image_url: imageUrl ?? null,
          p_address_line_1: nullIfBlank(input.address_line_1),
          p_address_line_2: nullIfBlank(input.address_line_2),
          p_locality: nullIfBlank(input.locality),
          p_administrative_area: nullIfBlank(input.administrative_area),
          p_country_code: nullIfBlank(input.country_code)?.toUpperCase(),
          p_postal_code: nullIfBlank(input.postal_code),
        })
        .abortSignal(signal);
      if (error) throw normalizeApiError(error, "We could not add this find.");
      const created = await getEntity(data.id);
      if (!created)
        throw new Error("The find was added but could not be reloaded.");
      return created;
    } catch (error) {
      if (uploadedPath)
        await supabase.storage.from("entity-images").remove([uploadedPath]);
      throw error;
    }
  });
}

export function getEntity(entityId: string): Promise<Entity | null> {
  return runApiRequest(
    async (signal) => {
      const { data, error } = await supabase
        .from("entities")
        .select(ENTITY_SELECT)
        .eq("id", entityId)
        .abortSignal(signal)
        .maybeSingle();
      if (error) throw normalizeApiError(error, "We could not load this find.");
      return data as unknown as Entity | null;
    },
    { retries: 1 },
  );
}

export function getEntitiesByIds(entityIds: string[]): Promise<Entity[]> {
  if (!entityIds.length) return Promise.resolve([]);
  return runApiRequest(
    async (signal) => {
      const { data, error } = await supabase
        .from("entities")
        .select(ENTITY_SELECT)
        .in("id", entityIds)
        .abortSignal(signal);
      if (error) throw normalizeApiError(error, "We could not load finds.");
      return data as unknown as Entity[];
    },
    { retries: 1 },
  );
}

export function searchEntities(
  query: string,
  categorySlug?: string,
): Promise<Entity[]> {
  const term = query.trim().replace(/\s+/g, " ").toLowerCase();
  if (!term) return Promise.resolve([]);
  const pattern = `%${term.replace(/[\\%_]/g, "\\$&")}%`;
  return runApiRequest(
    async (signal) => {
      let request = supabase
        .from("entities")
        .select(ENTITY_SELECT)
        .or(
          `normalized_name.ilike.${pattern},normalized_locality.ilike.${pattern},normalized_address.ilike.${pattern}`,
        )
        .order("normalized_name", { ascending: true })
        .limit(ENTITY_SEARCH_LIMIT);
      if (categorySlug) request = request.eq("category.slug", categorySlug);
      const { data, error } = await request.abortSignal(signal);
      if (error) throw normalizeApiError(error, "We could not search finds.");
      return data as unknown as Entity[];
    },
    { retries: 1 },
  );
}

function nullIfBlank(value: string | null | undefined) {
  return value?.trim() || null;
}

export function deleteEntity(entityId: string): Promise<void> {
  return runApiRequest(async (signal) => {
    const { data, error } = await supabase
      .from("entities")
      .delete()
      .eq("id", entityId)
      .select("id")
      .abortSignal(signal)
      .maybeSingle();
    if (error) {
      if (error.code === "23503")
        throw new Error(
          "This find is used in posts or Picks and cannot be deleted.",
        );
      throw normalizeApiError(error, "We could not delete this find.");
    }
    if (!data) throw new Error("You cannot delete this find.");
  });
}
