import { Link } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import type { CommentThread, CommentWithAuthor } from "@/api/comments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { routes } from "@/lib/routes";
import { useAuth } from "@/providers/auth-provider";
import {
  useCreateReply,
  useCreateTopLevelComment,
  useDeleteComment,
  type useTopLevelComments,
  useUpdateComment,
} from "@/queries/comments";

type CommentSectionProps = {
  comments: ReturnType<typeof useTopLevelComments>;
  postId: string;
};

export function CommentSection({ comments, postId }: CommentSectionProps) {
  const { user } = useAuth();
  const [body, setBody] = useState("");
  const [editing, setEditing] = useState<CommentWithAuthor | null>(null);
  const [editBody, setEditBody] = useState("");
  const [deleting, setDeleting] = useState<CommentWithAuthor | null>(null);
  const [replyingTo, setReplyingTo] = useState<CommentWithAuthor | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const createComment = useCreateTopLevelComment(postId, user?.id ?? "");
  const createReply = useCreateReply(postId, user?.id ?? "");
  const updateComment = useUpdateComment(postId);
  const deleteComment = useDeleteComment(postId);
  const items = comments.data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = comments.data?.pages[0]?.totalCount ?? 0;
  const canPost = body.trim().length > 0 && !createComment.isPending;
  const canSave = editBody.trim().length > 0 && !updateComment.isPending;
  const canReply = replyBody.trim().length > 0 && !createReply.isPending;

  const submit = async () => {
    if (!canPost) return;

    try {
      await createComment.mutateAsync(body);
      setBody("");
    } catch {
      // Keep the draft and show the mutation error so the user can retry.
    }
  };

  const openEditor = (comment: CommentWithAuthor) => {
    updateComment.reset();
    setEditBody(comment.body);
    setEditing(comment);
  };

  const openReply = (comment: CommentWithAuthor) => {
    createReply.reset();
    setReplyBody("");
    setReplyingTo(comment);
  };

  const submitReply = async () => {
    if (!replyingTo || !canReply) return;

    try {
      await createReply.mutateAsync({
        body: replyBody,
        parentId: replyingTo.id,
      });
      setReplyingTo(null);
      setReplyBody("");
    } catch {
      // Keep the reply draft visible and show the error for a retry.
    }
  };

  const save = async () => {
    if (!editing || !canSave) return;

    try {
      await updateComment.mutateAsync({
        body: editBody,
        commentId: editing.id,
      });
      setEditing(null);
    } catch {
      // Keep the editor open and show the mutation error for a retry.
    }
  };

  const remove = async () => {
    if (!deleting) return;

    try {
      await deleteComment.mutateAsync(deleting.id);
      setDeleting(null);
    } catch {
      // Keep the confirmation open and show the mutation error for a retry.
    }
  };

  return (
    <View className="gap-3">
      <View className="flex-row items-baseline justify-between gap-3">
        <Text className="text-xl font-semibold">Comments</Text>
        <Text className="rounded-md bg-secondary px-2 py-1 text-sm text-secondary-foreground">
          {totalCount} {totalCount === 1 ? "comment" : "comments"}
        </Text>
      </View>

      <View className="gap-3 rounded-lg border border-border bg-card p-3 shadow-none">
        <Input
          accessibilityLabel="Write a comment"
          className="min-h-24 items-start py-3"
          editable={!createComment.isPending}
          maxLength={2000}
          multiline
          onChangeText={setBody}
          placeholder="Add to the conversation…"
          textAlignVertical="top"
          value={body}
        />
        <View className="flex-row items-center justify-between gap-3">
          <Text variant="muted">{body.length}/2000</Text>
          <Button disabled={!canPost} onPress={() => void submit()}>
            <Text>{createComment.isPending ? "Posting…" : "Post comment"}</Text>
          </Button>
        </View>
        {createComment.isError ? (
          <Text className="text-destructive" variant="small">
            {createComment.error.message}
          </Text>
        ) : null}
      </View>

      {comments.isLoading ? <CommentListLoading /> : null}

      {comments.isError && items.length === 0 ? (
        <View className="items-start gap-3 rounded-lg border border-border p-3">
          <Text className="font-medium">Comments could not be loaded.</Text>
          <Text variant="muted">Check your connection and try again.</Text>
          <Button variant="outline" onPress={() => void comments.refetch()}>
            <Text>Try again</Text>
          </Button>
        </View>
      ) : null}

      {!comments.isLoading && !comments.isError && items.length === 0 ? (
        <View className="rounded-lg border border-dashed border-border p-3">
          <Text className="font-medium">No comments yet.</Text>
          <Text variant="muted">Start the conversation.</Text>
        </View>
      ) : null}

      {items.length > 0 ? (
        <View className="gap-3">
          {items.map((comment) => (
            <CommentThreadItem
              key={comment.id}
              comment={comment}
              currentUserId={user?.id}
              onDelete={(target) => {
                deleteComment.reset();
                setDeleting(target);
              }}
              onEdit={openEditor}
              onReply={openReply}
            />
          ))}
        </View>
      ) : null}

      {comments.hasNextPage ? (
        <Button
          disabled={comments.isFetchingNextPage}
          variant="outline"
          onPress={() => void comments.fetchNextPage()}
        >
          <Text>
            {comments.isFetchingNextPage ? "Loading…" : "Load more comments"}
          </Text>
        </Button>
      ) : null}

      {comments.isFetchNextPageError ? (
        <View className="items-start gap-2">
          <Text className="text-destructive" variant="small">
            More comments could not be loaded.
          </Text>
          <Button variant="link" onPress={() => void comments.fetchNextPage()}>
            <Text>Try again</Text>
          </Button>
        </View>
      ) : null}

      <Dialog
        open={replyingTo !== null}
        onOpenChange={(open) => !open && setReplyingTo(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Reply{replyingTo ? ` to ${replyingTo.author.display_name}` : ""}
            </DialogTitle>
            <DialogDescription>
              Your reply will appear beneath this comment.
            </DialogDescription>
          </DialogHeader>
          <View className="gap-2">
            <Input
              accessibilityLabel="Write a reply"
              className="min-h-28 items-start py-3"
              editable={!createReply.isPending}
              maxLength={2000}
              multiline
              onChangeText={setReplyBody}
              placeholder="Write a reply…"
              textAlignVertical="top"
              value={replyBody}
            />
            <Text className="text-right" variant="muted">
              {replyBody.length}/2000
            </Text>
            {createReply.isError ? (
              <Text className="text-destructive" variant="small">
                {createReply.error.message}
              </Text>
            ) : null}
          </View>
          <DialogFooter>
            <Button
              disabled={createReply.isPending}
              onPress={() => setReplyingTo(null)}
              variant="ghost"
            >
              <Text>Cancel</Text>
            </Button>
            <Button disabled={!canReply} onPress={() => void submitReply()}>
              <Text>{createReply.isPending ? "Replying…" : "Post reply"}</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit comment</DialogTitle>
            <DialogDescription>Update what you wrote.</DialogDescription>
          </DialogHeader>
          <View className="gap-2">
            <Input
              className="min-h-28 items-start py-3"
              editable={!updateComment.isPending}
              maxLength={2000}
              multiline
              onChangeText={setEditBody}
              textAlignVertical="top"
              value={editBody}
            />
            <Text className="text-right" variant="muted">
              {editBody.length}/2000
            </Text>
            {updateComment.isError ? (
              <Text className="text-destructive" variant="small">
                {updateComment.error.message}
              </Text>
            ) : null}
          </View>
          <DialogFooter>
            <Button
              disabled={updateComment.isPending}
              onPress={() => setEditing(null)}
              variant="ghost"
            >
              <Text>Cancel</Text>
            </Button>
            <Button disabled={!canSave} onPress={() => void save()}>
              <Text>
                {updateComment.isPending ? "Saving…" : "Save changes"}
              </Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this comment?</DialogTitle>
            <DialogDescription>
              This permanently removes the comment.
            </DialogDescription>
          </DialogHeader>
          {deleteComment.isError ? (
            <Text className="text-destructive" variant="small">
              {deleteComment.error.message}
            </Text>
          ) : null}
          <DialogFooter>
            <Button
              disabled={deleteComment.isPending}
              onPress={() => setDeleting(null)}
              variant="ghost"
            >
              <Text>Cancel</Text>
            </Button>
            <Button
              disabled={deleteComment.isPending}
              onPress={() => void remove()}
              variant="destructive"
            >
              <Text>
                {deleteComment.isPending ? "Deleting…" : "Delete comment"}
              </Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  );
}

function CommentThreadItem({
  comment,
  currentUserId,
  onDelete,
  onEdit,
  onReply,
}: {
  comment: CommentThread;
  currentUserId?: string;
  onDelete: (comment: CommentWithAuthor) => void;
  onEdit: (comment: CommentWithAuthor) => void;
  onReply: (comment: CommentWithAuthor) => void;
}) {
  return (
    <View className="gap-2">
      <CommentItem
        comment={comment}
        isOwn={comment.author_id === currentUserId}
        onDelete={() => onDelete(comment)}
        onEdit={() => onEdit(comment)}
        onReply={() => onReply(comment)}
      />
      {comment.replies.length > 0 ? (
        <View className="ml-4 gap-2 border-l-2 border-secondary pl-3 sm:ml-8 sm:pl-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              isOwn={reply.author_id === currentUserId}
              onDelete={() => onDelete(reply)}
              onEdit={() => onEdit(reply)}
              isReply
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

function CommentItem({
  comment,
  isReply = false,
  isOwn,
  onDelete,
  onEdit,
  onReply,
}: {
  comment: CommentWithAuthor;
  isReply?: boolean;
  isOwn: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onReply?: () => void;
}) {
  return (
    <View
      className={
        isReply
          ? "gap-2 rounded-md bg-muted/70 p-3"
          : "gap-3 rounded-lg border border-border bg-card p-3 shadow-none"
      }
    >
      <View className="flex-row items-start justify-between gap-3">
        <Link href={routes.user(comment.author.username)} asChild>
          <Button
            variant="ghost"
            className="h-auto min-w-0 flex-1 justify-start gap-3 px-0 py-0"
          >
            <Avatar
              alt={`${comment.author.display_name}'s avatar`}
              className="size-9"
            >
              {comment.author.avatar_url ? (
                <AvatarImage
                  accessibilityLabel={`${comment.author.display_name}'s avatar`}
                  source={{ uri: comment.author.avatar_url }}
                />
              ) : null}
              <AvatarFallback>
                <Text variant="small">
                  {getInitials(comment.author.display_name)}
                </Text>
              </AvatarFallback>
            </Avatar>
            <View className="min-w-0 flex-1 items-start">
              <Text className="font-medium" numberOfLines={1}>
                {comment.author.display_name}
              </Text>
              <Text numberOfLines={1} variant="muted">
                @{comment.author.username} ·{" "}
                {formatCommentDate(comment.created_at)}
                {comment.updated_at !== comment.created_at ? " · edited" : ""}
              </Text>
            </View>
          </Button>
        </Link>
        {isOwn ? (
          <View className="flex-row gap-1">
            <Button onPress={onEdit} size="sm" variant="ghost">
              <Text>Edit</Text>
            </Button>
            <Button onPress={onDelete} size="sm" variant="ghost">
              <Text className="text-destructive">Delete</Text>
            </Button>
          </View>
        ) : null}
      </View>
      <Text className="leading-6">{comment.body}</Text>
      {onReply ? (
        <Button
          className="self-start"
          onPress={onReply}
          size="sm"
          variant="ghost"
        >
          <Text>Reply</Text>
        </Button>
      ) : null}
    </View>
  );
}

function CommentListLoading() {
  return (
    <View className="gap-3">
      <Skeleton className="h-28 w-full rounded-xl" />
      <Skeleton className="h-28 w-full rounded-xl" />
    </View>
  );
}

function formatCommentDate(createdAt: string) {
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(createdAt));
}

function getInitials(displayName: string) {
  return displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
