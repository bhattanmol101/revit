import { supabase } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";

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
export type CommentThread = CommentWithAuthor & {
  replies: CommentWithAuthor[];
};
export type CommentPage = {
  items: CommentThread[];
  nextOffset?: number;
  totalCount: number;
};
export function getCommentCount(postId: string): Promise<number> {
  return runApiRequest(
    async (signal) => {
      const { count, error } = await supabase
        .from("comments")
        .select("id", { count: "exact", head: true })
        .eq("post_id", postId)
        .abortSignal(signal);

      if (error) {
        throw normalizeApiError(error, "We could not load the comment count.");
      }

      return count ?? 0;
    },
    { retries: 1 },
  );
}

export function getTopLevelComments(
  postId: string,
  offset = 0,
): Promise<CommentPage> {
  return runApiRequest(
    async (signal) => {
      const [topLevelResult, countResult] = await Promise.all([
        supabase
          .from("comments")
          .select(COMMENT_SELECT)
          .eq("post_id", postId)
          .is("parent_id", null)
          .order("created_at", { ascending: true })
          .order("id", { ascending: true })
          .range(offset, offset + COMMENT_PAGE_SIZE)
          .abortSignal(signal),
        supabase
          .from("comments")
          .select("id", { count: "exact", head: true })
          .eq("post_id", postId)
          .abortSignal(signal),
      ]);

      if (topLevelResult.error) {
        throw normalizeApiError(
          topLevelResult.error,
          "We could not load the comments.",
        );
      }

      if (countResult.error) {
        throw normalizeApiError(
          countResult.error,
          "We could not load the comment count.",
        );
      }

      const hasNextPage = topLevelResult.data.length > COMMENT_PAGE_SIZE;
      const topLevelComments = topLevelResult.data.slice(0, COMMENT_PAGE_SIZE);
      const parentIds = topLevelComments.map((comment) => comment.id);
      let replies: CommentWithAuthor[] = [];

      if (parentIds.length > 0) {
        const { data, error } = await supabase
          .from("comments")
          .select(COMMENT_SELECT)
          .in("parent_id", parentIds)
          .order("created_at", { ascending: true })
          .order("id", { ascending: true })
          .abortSignal(signal);

        if (error) {
          throw normalizeApiError(error, "We could not load the replies.");
        }

        replies = data;
      }

      return {
        items: topLevelComments.map((comment) => ({
          ...comment,
          replies: replies.filter((reply) => reply.parent_id === comment.id),
        })),
        nextOffset: hasNextPage ? offset + COMMENT_PAGE_SIZE : undefined,
        totalCount: countResult.count ?? 0,
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
  return createComment(input);
}

export function createReply(input: {
  authorId: string;
  body: string;
  parentId: string;
  postId: string;
}): Promise<CommentWithAuthor> {
  return createComment(input);
}

function createComment(input: {
  authorId: string;
  body: string;
  parentId?: string;
  postId: string;
}): Promise<CommentWithAuthor> {
  const body = validateCommentBody(input.body);

  return runApiRequest(async (signal) => {
    const { data, error } = await supabase
      .from("comments")
      .insert({
        author_id: input.authorId,
        body,
        parent_id: input.parentId ?? null,
        post_id: input.postId,
      })
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
