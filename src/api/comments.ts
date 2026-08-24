import type { Tables } from "@/lib/supabase/database.types";
import { supabase } from "@/lib/supabase/client";

import { normalizeApiError } from "./errors";
import { runApiRequest } from "./request";

const COMMENT_PAGE_SIZE = 10;
const COMMENT_SELECT =
  "id, post_id, author_id, parent_id, body, created_at, updated_at, author:profiles!comments_author_id_fkey(id, username, display_name, avatar_url)" as const;

export type Comment = Tables<"comments">;
export type CommentAuthor = Pick<
  Tables<"profiles">,
  "avatar_url" | "display_name" | "id" | "username"
>;
export type CommentWithAuthor = Comment & { author: CommentAuthor };
export type CommentPage = {
  items: CommentWithAuthor[];
  nextOffset?: number;
  totalCount: number;
};

export function getTopLevelComments(
  postId: string,
  offset = 0,
): Promise<CommentPage> {
  return runApiRequest(
    async (signal) => {
      const { count, data, error } = await supabase
        .from("comments")
        .select(COMMENT_SELECT, { count: "exact" })
        .eq("post_id", postId)
        .is("parent_id", null)
        .order("created_at", { ascending: true })
        .order("id", { ascending: true })
        .range(offset, offset + COMMENT_PAGE_SIZE)
        .abortSignal(signal);

      if (error) {
        throw normalizeApiError(error, "We could not load the comments.");
      }

      const hasNextPage = data.length > COMMENT_PAGE_SIZE;

      return {
        items: data.slice(0, COMMENT_PAGE_SIZE),
        nextOffset: hasNextPage ? offset + COMMENT_PAGE_SIZE : undefined,
        totalCount: count ?? 0,
      };
    },
    { retries: 1 },
  );
}

export function createTopLevelComment(input: {
  authorId: string;
  body: string;
  postId: string;
}): Promise<CommentWithAuthor> {
  const body = validateCommentBody(input.body);

  return runApiRequest(async (signal) => {
    const { data, error } = await supabase
      .from("comments")
      .insert({ author_id: input.authorId, body, post_id: input.postId })
      .select(COMMENT_SELECT)
      .abortSignal(signal)
      .single();

    if (error) {
      throw normalizeApiError(error, "We could not post your comment.");
    }

    return data;
  });
}

export function updateComment(
  commentId: string,
  bodyInput: string,
): Promise<CommentWithAuthor> {
  const body = validateCommentBody(bodyInput);

  return runApiRequest(async (signal) => {
    const { data, error } = await supabase
      .from("comments")
      .update({ body })
      .eq("id", commentId)
      .select(COMMENT_SELECT)
      .abortSignal(signal)
      .single();

    if (error) {
      throw normalizeApiError(error, "We could not update your comment.");
    }

    return data;
  });
}

export function deleteComment(commentId: string): Promise<void> {
  return runApiRequest(async (signal) => {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId)
      .abortSignal(signal);

    if (error) {
      throw normalizeApiError(error, "We could not delete your comment.");
    }
  });
}

function validateCommentBody(bodyInput: string) {
  const body = bodyInput.trim();

  if (body.length < 1 || body.length > 2000) {
    throw new Error("A comment must be between 1 and 2,000 characters.");
  }

  return body;
}
