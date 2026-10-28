import { randomUUID } from "expo-crypto";
import { supabase } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";

import { normalizeApiError } from "./errors";
import type { AskImageUpload } from "./posts";
import { runApiRequest } from "./request";

export type Forum = Tables<"forums">;

export type ForumSummary = Forum & {
  coverImageUrl: string | null;
  imageUrl: string | null;
  isMember: boolean;
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
  input: CreateForumInput & {
    forumImage?: AskImageUpload;
    coverImage?: AskImageUpload;
  },
): Promise<Forum> {
  return runApiRequest(async (signal) => {
    const forumId =
      input.forumImage || input.coverImage ? randomUUID() : undefined;
    const imagePath = input.forumImage
      ? `${input.ownerId}/${forumId}/image.${input.forumImage.extension}`
      : undefined;
    const coverPath = input.coverImage
      ? `${input.ownerId}/${forumId}/cover.${input.coverImage.extension}`
      : undefined;
    const uploadedPaths = [imagePath, coverPath].filter(
      (path): path is string => Boolean(path),
    );
    try {
      for (const [image, path, label] of [
        [input.forumImage, imagePath, "forum image"],
        [input.coverImage, coverPath, "forum cover"],
      ] as const) {
        if (!image || !path) continue;
        const { error: uploadError } = await supabase.storage
          .from("forum-images")
          .upload(path, image.data, {
            contentType: image.contentType,
            upsert: false,
          });
        if (uploadError) {
          throw normalizeApiError(
            uploadError,
            `We could not upload the ${label}.`,
          );
        }
      }

      const { data, error } = await supabase
        .from("forums")
        .insert({
          ...(forumId ? { id: forumId } : {}),
          ...(imagePath ? { image_path: imagePath } : {}),
          ...(coverPath ? { cover_image_path: coverPath } : {}),
          description: input.description?.trim() || null,
          name: input.name.trim(),
          owner_id: input.ownerId,
          rules: input.rules.trim(),
          slug: input.slug.trim(),
        })
        .select(
          "id, owner_id, slug, name, description, rules, image_path, cover_image_path, created_at, updated_at",
        )
        .abortSignal(signal)
        .single();

      if (error)
        throw normalizeApiError(error, "We could not create this forum.");
      return data;
    } catch (cause) {
      if (uploadedPaths.length > 0) {
        await supabase.storage.from("forum-images").remove(uploadedPaths);
      }
      throw cause;
    }
  });
}

export function getForums(): Promise<ForumSummary[]> {
  return runApiRequest(
    async (signal) => {
      const { data: forums, error: forumsError } = await supabase
        .rpc("get_forum_summaries", {})
        .abortSignal(signal);

      if (forumsError) {
        throw normalizeApiError(forumsError, "We could not load forums.");
      }

      const summaries = forums.map((forum) => ({
        cover_image_path: forum.cover_image_path,
        created_at: forum.created_at,
        description: forum.description,
        id: forum.id,
        image_path: forum.image_path,
        isMember: forum.is_member,
        memberCount: forum.member_count,
        name: forum.name,
        owner_id: forum.owner_id,
        rules: forum.rules,
        slug: forum.slug,
        updated_at: forum.updated_at,
      }));

      return signForumImages(summaries);
    },
    { retries: 1 },
  );
}

export function getForum(forumId: string): Promise<ForumDetail | null> {
  return runApiRequest(
    async (signal) => {
      const { data: forum, error: forumError } = await supabase
        .rpc("get_forum_summaries", { p_forum_id: forumId })
        .abortSignal(signal)
        .maybeSingle();

      if (forumError) {
        throw normalizeApiError(forumError, "We could not load this forum.");
      }

      if (!forum) return null;

      const [detail] = await signForumImages([
        {
          cover_image_path: forum.cover_image_path,
          created_at: forum.created_at,
          description: forum.description,
          id: forum.id,
          image_path: forum.image_path,
          isMember: forum.is_member,
          memberCount: forum.member_count,
          name: forum.name,
          owner_id: forum.owner_id,
          rules: forum.rules,
          slug: forum.slug,
          updated_at: forum.updated_at,
        },
      ]);
      return detail;
    },
    { retries: 1 },
  );
}

async function signForumImages<T extends Forum>(
  forums: T[],
): Promise<
  Array<T & { coverImageUrl: string | null; imageUrl: string | null }>
> {
  const paths = forums.flatMap((forum) => [
    ...(forum.image_path ? [forum.image_path] : []),
    ...(forum.cover_image_path ? [forum.cover_image_path] : []),
  ]);
  if (paths.length === 0) {
    return forums.map((forum) => ({
      ...forum,
      coverImageUrl: null,
      imageUrl: null,
    }));
  }

  const { data, error } = await supabase.storage
    .from("forum-images")
    .createSignedUrls(paths, 60 * 60);
  if (error) throw normalizeApiError(error, "We could not load forum images.");

  const urls = new Map(data.map(({ path, signedUrl }) => [path, signedUrl]));
  return forums.map((forum) => ({
    ...forum,
    coverImageUrl: forum.cover_image_path
      ? (urls.get(forum.cover_image_path) ?? null)
      : null,
    imageUrl: forum.image_path ? (urls.get(forum.image_path) ?? null) : null,
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
