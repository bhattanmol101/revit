import { supabase } from "@/lib/supabase/client";
import type { Tables, TablesUpdate } from "@/lib/supabase/database.types";

import { normalizeApiError } from "./errors";
import { runApiRequest } from "./request";

const POST_IMAGES_BUCKET = "post-images";
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const POST_PAGE_SIZE = 10;
const SIGNED_URL_TTL_SECONDS = 60 * 60;

export type Post = Tables<"posts">;
export type PostMedia = Tables<"post_media">;

export type PostAuthor = Pick<
  Tables<"profiles">,
  "avatar_url" | "display_name" | "id" | "username"
>;

export type PostWithDetails = Post & {
  author: PostAuthor;
  media: Array<PostMedia & { signedUrl: string }>;
};

export type PostPage = {
  items: PostWithDetails[];
  nextOffset?: number;
};

export type UpdateAskPostInput = Pick<TablesUpdate<"posts">, "body" | "title">;

type RawPostWithDetails = Post & {
  author: PostAuthor;
  media: PostMedia[];
};

const POST_DETAILS_SELECT =
  "id, author_id, post_type, entity_id, forum_id, title, body, created_at, updated_at, author:profiles!posts_author_id_fkey(id, username, display_name, avatar_url), media:post_media(id, post_id, storage_path, position, alt_text, created_at)";

export type AskImageUpload = {
  contentType:
    | "image/heic"
    | "image/heif"
    | "image/jpeg"
    | "image/png"
    | "image/webp";
  data: ArrayBuffer;
  extension: "heic" | "heif" | "jpeg" | "jpg" | "png" | "webp";
};

export type CreateAskPostInput = {
  authorId: string;
  body?: string;
  images: AskImageUpload[];
  title: string;
};

export type CreateForumAskPostInput = CreateAskPostInput & {
  forumId: string;
};

export type CreateForumSharePostInput = {
  authorId: string;
  body?: string;
  entityId: string;
  forumId: string;
  images: AskImageUpload[];
};

export function createForumAskPost(
  input: CreateForumAskPostInput,
): Promise<Post> {
  validateAskPost(input);
  return createForumPost({
    authorId: input.authorId,
    body: input.body,
    forumId: input.forumId,
    images: input.images,
    postType: "ASK",
    title: input.title,
  });
}

export function createForumSharePost(
  input: CreateForumSharePostInput,
): Promise<Post> {
  return createForumPost({
    authorId: input.authorId,
    body: input.body,
    entityId: input.entityId,
    forumId: input.forumId,
    images: input.images,
    postType: "SHARE",
  });
}

export async function createAskPost(input: CreateAskPostInput): Promise<Post> {
  validateAskPost(input);

  const postId = crypto.randomUUID();
  await reservePostImageCleanup(input.authorId, postId, input.images);
  const uploadedPaths = await uploadPostImages({
    authorId: input.authorId,
    images: input.images,
    postId,
  });

  try {
    return await runApiRequest(async (signal) => {
      const { data, error } = await supabase
        .rpc("create_ask_post_with_media", {
          p_body: input.body?.trim() || undefined,
          p_media_paths: uploadedPaths,
          p_post_id: postId,
          p_title: input.title.trim(),
        })
        .abortSignal(signal)
        .single();

      if (error) {
        throw normalizeApiError(error, "We could not create your Ask post.");
      }

      return data;
    });
  } catch (error) {
    await removePostImages(uploadedPaths);
    throw error;
  }
}

function createForumPost({
  authorId,
  body,
  entityId,
  forumId,
  images,
  postType,
  title,
}: {
  authorId: string;
  body?: string;
  entityId?: string;
  forumId: string;
  images: AskImageUpload[];
  postType: "ASK" | "SHARE";
  title?: string;
}): Promise<Post> {
  return runApiRequest(async (signal) => {
    const { data, error } = await supabase
      .from("posts")
      .insert({
        author_id: authorId,
        body: body?.trim() || null,
        entity_id: entityId ?? null,
        forum_id: forumId,
        post_type: postType,
        title: title?.trim() || null,
      })
      .select(
        "id, author_id, post_type, entity_id, forum_id, title, body, created_at, updated_at",
      )
      .abortSignal(signal)
      .single();

    if (error) {
      throw normalizeApiError(error, "We could not publish this forum post.");
    }

    try {
      await attachPostImages({
        authorId,
        images,
        postId: data.id,
        signal,
      });
      return data;
    } catch (error) {
      await cleanUpFailedPost(data.id, []);
      throw error;
    }
  });
}

export async function attachPostImages({
  authorId,
  images,
  postId,
  signal,
}: {
  authorId: string;
  images: AskImageUpload[];
  postId: string;
  signal: AbortSignal;
}) {
  const uploadedPaths = await uploadPostImages({
    authorId,
    images,
    postId,
    signal,
  });

  try {
    if (uploadedPaths.length === 0) return;

    const { error: mediaError } = await supabase
      .from("post_media")
      .insert(
        uploadedPaths.map((storagePath, index) => ({
          position: index + 1,
          post_id: postId,
          storage_path: storagePath,
        })),
      )
      .abortSignal(signal);

    if (mediaError) {
      throw normalizeApiError(
        mediaError,
        "We could not attach the images to your post.",
      );
    }
  } catch (error) {
    await removePostImages(uploadedPaths);
    throw error;
  }
}

export async function uploadPostImages({
  authorId,
  images,
  postId,
  signal,
}: {
  authorId: string;
  images: AskImageUpload[];
  postId: string;
  signal?: AbortSignal;
}) {
  const uploadedPaths: string[] = [];

  try {
    for (const [index, image] of images.entries()) {
      signal?.throwIfAborted();
      const storagePath = `${authorId}/${postId}/${index + 1}.${image.extension}`;
      const { error } = await supabase.storage
        .from(POST_IMAGES_BUCKET)
        .upload(storagePath, image.data, {
          cacheControl: "31536000",
          contentType: image.contentType,
          upsert: false,
        });

      if (error) {
        throw normalizeApiError(error, "An image could not be uploaded.");
      }
      uploadedPaths.push(storagePath);
    }

    return uploadedPaths;
  } catch (error) {
    await removePostImages(uploadedPaths);
    throw error;
  }
}

export async function reservePostImageCleanup(
  ownerId: string,
  postId: string,
  images: AskImageUpload[],
) {
  if (images.length === 0) return;
  const { error } = await supabase.from("post_image_cleanup").insert(
    images.map((image, index) => ({
      owner_id: ownerId,
      storage_path: `${ownerId}/${postId}/${index + 1}.${image.extension}`,
    })),
  );
  if (error) {
    throw normalizeApiError(error, "We could not prepare the image upload.");
  }
}

export async function removePostImages(storagePaths: string[]) {
  if (storagePaths.length === 0) return;
  const { error } = await supabase.storage
    .from(POST_IMAGES_BUCKET)
    .remove(storagePaths);
  if (error) {
    throw normalizeApiError(error, "We could not clean up post images.");
  }
}

export function getPost(postId: string): Promise<PostWithDetails | null> {
  return runApiRequest(
    async (signal) => {
      const { data, error } = await supabase
        .from("posts")
        .select(POST_DETAILS_SELECT)
        .eq("id", postId)
        .abortSignal(signal)
        .maybeSingle();

      if (error) {
        throw normalizeApiError(error, "We could not load this post.");
      }

      if (!data) return null;

      const [post] = await signPostMedia([data]);
      return post;
    },
    { retries: 1 },
  );
}

export function getPostsByIds(postIds: string[]): Promise<PostWithDetails[]> {
  if (postIds.length === 0) return Promise.resolve([]);

  return runApiRequest(
    async (signal) => {
      const { data, error } = await supabase
        .from("posts")
        .select(POST_DETAILS_SELECT)
        .in("id", postIds)
        .abortSignal(signal);

      if (error) {
        throw normalizeApiError(error, "We could not load feed posts.");
      }

      const byId = new Map(
        (await signPostMedia(data)).map((post) => [post.id, post]),
      );

      return postIds.flatMap((postId) => {
        const post = byId.get(postId);
        return post ? [post] : [];
      });
    },
    { retries: 1 },
  );
}

export function getAskPostsByAuthor(
  authorId: string,
  offset = 0,
): Promise<PostPage> {
  return runApiRequest(
    async (signal) => {
      const { data, error } = await supabase
        .from("posts")
        .select(POST_DETAILS_SELECT)
        .eq("author_id", authorId)
        .eq("post_type", "ASK")
        .order("created_at", { ascending: false })
        .order("id", { ascending: true })
        .range(offset, offset + POST_PAGE_SIZE)
        .abortSignal(signal);

      if (error) {
        throw normalizeApiError(error, "We could not load Ask posts.");
      }

      const hasNextPage = data.length > POST_PAGE_SIZE;
      const items = await signPostMedia(data.slice(0, POST_PAGE_SIZE));

      return {
        items,
        nextOffset: hasNextPage ? offset + POST_PAGE_SIZE : undefined,
      };
    },
    { retries: 1 },
  );
}

export function getForumPosts(forumId: string, offset = 0): Promise<PostPage> {
  return runApiRequest(
    async (signal) => {
      const { data, error } = await supabase
        .from("posts")
        .select(POST_DETAILS_SELECT)
        .eq("forum_id", forumId)
        .order("created_at", { ascending: false })
        .order("id", { ascending: true })
        .range(offset, offset + POST_PAGE_SIZE)
        .abortSignal(signal);

      if (error) {
        throw normalizeApiError(error, "We could not load forum posts.");
      }

      const hasNextPage = data.length > POST_PAGE_SIZE;
      const items = await signPostMedia(data.slice(0, POST_PAGE_SIZE));

      return {
        items,
        nextOffset: hasNextPage ? offset + POST_PAGE_SIZE : undefined,
      };
    },
    { retries: 1 },
  );
}

export function getSharePostsByEntity(
  entityId: string,
  offset = 0,
): Promise<PostPage> {
  return runApiRequest(
    async (signal) => {
      const { data, error } = await supabase
        .from("posts")
        .select(POST_DETAILS_SELECT)
        .eq("entity_id", entityId)
        .eq("post_type", "SHARE")
        .order("created_at", { ascending: false })
        .order("id", { ascending: true })
        .range(offset, offset + POST_PAGE_SIZE)
        .abortSignal(signal);

      if (error) {
        throw normalizeApiError(error, "We could not load restaurant ratings.");
      }

      const hasNextPage = data.length > POST_PAGE_SIZE;
      const items = await signPostMedia(data.slice(0, POST_PAGE_SIZE));

      return {
        items,
        nextOffset: hasNextPage ? offset + POST_PAGE_SIZE : undefined,
      };
    },
    { retries: 1 },
  );
}

export function updateAskPost(
  postId: string,
  input: UpdateAskPostInput,
): Promise<Post> {
  const title = input.title?.trim() ?? "";
  const body = input.body?.trim() || null;

  if (title.length < 1 || title.length > 120) {
    throw new Error("The title must be between 1 and 120 characters.");
  }

  if ((body?.length ?? 0) > 2000) {
    throw new Error("The description must be 2,000 characters or fewer.");
  }

  return runApiRequest(async (signal) => {
    const { data, error } = await supabase
      .from("posts")
      .update({ body, title })
      .eq("id", postId)
      .eq("post_type", "ASK")
      .select(
        "id, author_id, post_type, entity_id, forum_id, title, body, created_at, updated_at",
      )
      .abortSignal(signal)
      .single();

    if (error) {
      throw normalizeApiError(error, "We could not update this Ask post.");
    }

    return data;
  });
}

export function deletePost(postId: string): Promise<void> {
  return runApiRequest(async (signal) => {
    const { data: storagePaths, error: deleteError } = await supabase
      .rpc("delete_post_with_cleanup", { p_post_id: postId })
      .abortSignal(signal);

    if (deleteError) {
      throw normalizeApiError(deleteError, "We could not delete this post.");
    }

    if (storagePaths.length > 0) {
      await removePostImages(storagePaths);
      const { error: cleanupError } = await supabase
        .from("post_image_cleanup")
        .delete()
        .in("storage_path", storagePaths)
        .abortSignal(signal);
      if (cleanupError) {
        throw normalizeApiError(cleanupError, "Image cleanup will be retried.");
      }
    }
  });
}

export async function cleanUpPendingPostImages(ownerId: string) {
  const { data, error } = await supabase
    .from("post_image_cleanup")
    .select("storage_path")
    .eq("owner_id", ownerId);

  if (error) {
    throw normalizeApiError(error, "We could not resume image cleanup.");
  }

  const storagePaths = data.map((item) => item.storage_path);
  if (storagePaths.length === 0) return;

  await removePostImages(storagePaths);
  const { error: cleanupError } = await supabase
    .from("post_image_cleanup")
    .delete()
    .in("storage_path", storagePaths);
  if (cleanupError) {
    throw normalizeApiError(cleanupError, "Image cleanup will be retried.");
  }
}

async function signPostMedia(
  posts: RawPostWithDetails[],
): Promise<PostWithDetails[]> {
  const storagePaths = posts.flatMap((post) =>
    post.media.map(({ storage_path }) => storage_path),
  );

  if (storagePaths.length === 0) {
    return posts.map((post) => ({ ...post, media: [] }));
  }

  const { data, error } = await supabase.storage
    .from(POST_IMAGES_BUCKET)
    .createSignedUrls(storagePaths, SIGNED_URL_TTL_SECONDS);

  if (error) {
    throw normalizeApiError(error, "We could not load post images.");
  }

  const signedUrls = new Map(
    data.map(({ path, signedUrl, error: signedUrlError }) => {
      if (!path || !signedUrl || signedUrlError) {
        throw new Error(signedUrlError ?? "A post image could not be loaded.");
      }

      return [path, signedUrl] as const;
    }),
  );

  return posts.map((post) => ({
    ...post,
    media: [...post.media]
      .sort((first, second) => first.position - second.position)
      .map((media) => {
        const signedUrl = signedUrls.get(media.storage_path);

        if (!signedUrl) {
          throw new Error("A post image could not be loaded.");
        }

        return { ...media, signedUrl };
      }),
  }));
}

function validateAskPost(input: CreateAskPostInput) {
  const titleLength = input.title.trim().length;
  const bodyLength = input.body?.trim().length ?? 0;

  if (!input.authorId) {
    throw new Error("You must be signed in to create a post.");
  }

  if (titleLength < 1 || titleLength > 120) {
    throw new Error("The title must be between 1 and 120 characters.");
  }

  if (bodyLength > 2000) {
    throw new Error("The description must be 2,000 characters or fewer.");
  }

  if (input.images.length > 3) {
    throw new Error("An Ask post can contain up to three images.");
  }

  for (const image of input.images) {
    if (
      image.data.byteLength === 0 ||
      image.data.byteLength > MAX_IMAGE_BYTES
    ) {
      throw new Error("Each image must be smaller than 10 MB.");
    }
  }
}

async function cleanUpFailedPost(postId: string, storagePaths: string[]) {
  if (storagePaths.length > 0) {
    await supabase.storage.from(POST_IMAGES_BUCKET).remove(storagePaths);
  }

  await supabase.from("posts").delete().eq("id", postId);
}
