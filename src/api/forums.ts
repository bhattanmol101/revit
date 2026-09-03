import { supabase } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";

import { normalizeApiError } from "./errors";
import type { AskImageUpload } from "./posts";
import { runApiRequest } from "./request";

export type Forum = Tables<"forums">;

export type ForumSummary = Forum & {
  coverImageUrl: string | null;
  memberCount: number;
};

export type ForumDetail = ForumSummary & {
  isMember: boolean;
};

export function deleteForum(forumId: string): Promise<void> {
  return runApiRequest(async (signal) => {
    const { error } = await supabase
      .from("forums")
      .delete()
      .eq("id", forumId)
      .abortSignal(signal);
    if (error)
      throw normalizeApiError(error, "We could not delete this forum.");
  });
}

export type CreateForumInput = Pick<
  Forum,
  "description" | "name" | "rules" | "slug"
> & { ownerId: string };

export function createForum(
  input: CreateForumInput & { coverImage?: AskImageUpload },
): Promise<Forum> {
  return runApiRequest(async (signal) => {
    const { data, error } = await supabase
      .from("forums")
      .insert({
        description: input.description?.trim() || null,
        name: input.name.trim(),
        owner_id: input.ownerId,
        rules: input.rules.trim(),
        slug: input.slug.trim(),
      })
      .select(
        "id, owner_id, slug, name, description, rules, cover_image_path, created_at, updated_at",
      )
      .abortSignal(signal)
      .single();

    if (error)
      throw normalizeApiError(error, "We could not create this forum.");
    if (!input.coverImage) return data;
    const path = `${input.ownerId}/${data.id}/cover.${input.coverImage.extension}`;
    try {
      const { error: uploadError } = await supabase.storage
        .from("forum-images")
        .upload(path, input.coverImage.data, {
          contentType: input.coverImage.contentType,
          upsert: false,
        });
      if (uploadError)
        throw normalizeApiError(
          uploadError,
          "We could not upload the forum cover.",
        );

      const { data: updated, error: updateError } = await supabase
        .from("forums")
        .update({ cover_image_path: path })
        .eq("id", data.id)
        .select(
          "id, owner_id, slug, name, description, rules, cover_image_path, created_at, updated_at",
        )
        .abortSignal(signal)
        .single();
      if (updateError)
        throw normalizeApiError(
          updateError,
          "We could not save the forum cover.",
        );
      return updated;
    } catch (cause) {
      await supabase.storage.from("forum-images").remove([path]);
      await supabase.from("forums").delete().eq("id", data.id);
      throw cause;
    }
  });
}

export function getForums(): Promise<ForumSummary[]> {
  return runApiRequest(
    async (signal) => {
      const { data: forums, error: forumsError } = await supabase
        .from("forums")
        .select(
          "id, owner_id, slug, name, description, rules, cover_image_path, created_at, updated_at",
        )
        .order("created_at", { ascending: false })
        .order("id", { ascending: true })
        .abortSignal(signal);

      if (forumsError) {
        throw normalizeApiError(forumsError, "We could not load forums.");
      }

      if (forums.length === 0) return [];

      const { data: memberships, error: membershipsError } = await supabase
        .from("forum_memberships")
        .select("forum_id")
        .in(
          "forum_id",
          forums.map((forum) => forum.id),
        )
        .abortSignal(signal);

      if (membershipsError) {
        throw normalizeApiError(
          membershipsError,
          "We could not load forum members.",
        );
      }

      const counts = new Map<string, number>();
      for (const membership of memberships) {
        counts.set(
          membership.forum_id,
          (counts.get(membership.forum_id) ?? 0) + 1,
        );
      }

      const summaries = forums.map((forum) => ({
        ...forum,
        memberCount: counts.get(forum.id) ?? 0,
      }));

      return signForumCovers(summaries);
    },
    { retries: 1 },
  );
}

export function getForum(
  forumId: string,
  userId: string,
): Promise<ForumDetail | null> {
  return runApiRequest(
    async (signal) => {
      const { data: forum, error: forumError } = await supabase
        .from("forums")
        .select(
          "id, owner_id, slug, name, description, rules, cover_image_path, created_at, updated_at",
        )
        .eq("id", forumId)
        .abortSignal(signal)
        .maybeSingle();

      if (forumError) {
        throw normalizeApiError(forumError, "We could not load this forum.");
      }

      if (!forum) return null;

      const { data: memberships, error: membershipsError } = await supabase
        .from("forum_memberships")
        .select("user_id")
        .eq("forum_id", forumId)
        .abortSignal(signal);

      if (membershipsError) {
        throw normalizeApiError(
          membershipsError,
          "We could not load forum members.",
        );
      }

      const [detail] = await signForumCovers([
        {
          ...forum,
          isMember: memberships.some(
            (membership) => membership.user_id === userId,
          ),
          memberCount: memberships.length,
        },
      ]);
      return detail;
    },
    { retries: 1 },
  );
}

async function signForumCovers<T extends Forum>(
  forums: T[],
): Promise<Array<T & { coverImageUrl: string | null }>> {
  const paths = forums.flatMap((forum) =>
    forum.cover_image_path ? [forum.cover_image_path] : [],
  );
  if (paths.length === 0)
    return forums.map((forum) => ({ ...forum, coverImageUrl: null }));

  const { data, error } = await supabase.storage
    .from("forum-images")
    .createSignedUrls(paths, 60 * 60);
  if (error) throw normalizeApiError(error, "We could not load forum covers.");

  const urls = new Map(data.map(({ path, signedUrl }) => [path, signedUrl]));
  return forums.map((forum) => ({
    ...forum,
    coverImageUrl: forum.cover_image_path
      ? (urls.get(forum.cover_image_path) ?? null)
      : null,
  }));
}

export function joinForum(forumId: string, userId: string): Promise<void> {
  return runApiRequest(async (signal) => {
    const { error } = await supabase
      .from("forum_memberships")
      .insert({ forum_id: forumId, user_id: userId })
      .abortSignal(signal);

    if (error) {
      throw normalizeApiError(error, "We could not join this forum.");
    }
  });
}

export function leaveForum(forumId: string, userId: string): Promise<void> {
  return runApiRequest(async (signal) => {
    const { error } = await supabase
      .from("forum_memberships")
      .delete()
      .eq("forum_id", forumId)
      .eq("user_id", userId)
      .abortSignal(signal);

    if (error) {
      throw normalizeApiError(error, "We could not leave this forum.");
    }
  });
}
