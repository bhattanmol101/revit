import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";

import type { PostWithDetails } from "@/api/posts";
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
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { ProfileMessageScreen } from "@/features/profile/profile-state-screen";
import { routes } from "@/lib/routes";
import { useAuth } from "@/providers/auth-provider";
import { useDeletePost, usePost, useUpdateAskPost } from "@/queries/posts";

import { AskPostCard } from "./ask-post-card";

export function PostDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const postId = Array.isArray(params.id) ? params.id[0] : (params.id ?? "");
  const post = usePost(postId);

  if (post.isLoading) {
    return <PostDetailLoading />;
  }

  if (post.isError) {
    return (
      <ProfileMessageScreen
        title="Post unavailable"
        description="We couldn’t load this post. Check your connection and try again."
        action={() => void post.refetch()}
      />
    );
  }

  if (!post.data) {
    return (
      <ProfileMessageScreen
        title="Post not found"
        description="This post may have been removed or is no longer available."
      />
    );
  }

  if (post.data.post_type !== "ASK") {
    return (
      <ProfileMessageScreen
        title="Share post"
        description="Share post presentation will be added with restaurant ratings."
      />
    );
  }

  return (
    <AskPostDetail
      isRefetching={post.isRefetching}
      post={post.data}
      refetch={post.refetch}
    />
  );
}

function AskPostDetail({
  isRefetching,
  post,
  refetch,
}: {
  isRefetching: boolean;
  post: PostWithDetails;
  refetch: ReturnType<typeof usePost>["refetch"];
}) {
  const { user } = useAuth();
  const isAuthor = user?.id === post.author_id;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <Stack.Screen options={{ title: "Ask" }} />
      <ScrollView
        contentContainerClassName="mx-auto w-full max-w-3xl px-5 py-6 sm:px-8"
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => void refetch()}
          />
        }
      >
        <AskPostCard
          isDetail
          post={post}
          actions={isAuthor ? <AuthorActions post={post} /> : undefined}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function AuthorActions({ post }: { post: PostWithDetails }) {
  const updatePost = useUpdateAskPost(post.id, post.author_id);
  const deletePost = useDeletePost(post.author_id);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [title, setTitle] = useState(post.title ?? "");
  const [body, setBody] = useState(post.body ?? "");
  const canSave =
    title.trim().length >= 1 &&
    title.trim().length <= 120 &&
    body.trim().length <= 2000 &&
    !updatePost.isPending;

  const openEditor = () => {
    setTitle(post.title ?? "");
    setBody(post.body ?? "");
    updatePost.reset();
    setIsEditOpen(true);
  };

  const save = async () => {
    if (!canSave) return;

    try {
      await updatePost.mutateAsync({ body, title });
      setIsEditOpen(false);
    } catch {
      // The mutation error stays visible in the editor for a retry.
    }
  };

  const remove = async () => {
    try {
      await deletePost.mutateAsync(post.id);
      setIsDeleteOpen(false);
      router.replace(routes.profile);
    } catch {
      // The mutation error stays visible in the confirmation for a retry.
    }
  };

  return (
    <>
      <Button variant="outline" onPress={openEditor}>
        <Text>Edit</Text>
      </Button>
      <Button variant="destructive" onPress={() => setIsDeleteOpen(true)}>
        <Text>Delete</Text>
      </Button>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Ask</DialogTitle>
            <DialogDescription>
              Update the title or details. Existing images keep their order.
            </DialogDescription>
          </DialogHeader>

          <View className="gap-4">
            <View className="gap-2">
              <Text variant="small">Title</Text>
              <Input
                editable={!updatePost.isPending}
                maxLength={120}
                value={title}
                onChangeText={setTitle}
              />
              <Text variant="muted" className="text-right">
                {title.length}/120
              </Text>
            </View>
            <View className="gap-2">
              <Text variant="small">Details (optional)</Text>
              <Input
                className="min-h-28 items-start py-3"
                editable={!updatePost.isPending}
                maxLength={2000}
                multiline
                textAlignVertical="top"
                value={body}
                onChangeText={setBody}
              />
              <Text variant="muted" className="text-right">
                {body.length}/2000
              </Text>
            </View>

            {updatePost.isError ? (
              <Text variant="small" className="text-destructive">
                {updatePost.error.message}
              </Text>
            ) : null}
          </View>

          <DialogFooter>
            <Button
              disabled={updatePost.isPending}
              variant="ghost"
              onPress={() => setIsEditOpen(false)}
            >
              <Text>Cancel</Text>
            </Button>
            <Button disabled={!canSave} onPress={() => void save()}>
              <Text>{updatePost.isPending ? "Saving…" : "Save changes"}</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this Ask?</DialogTitle>
            <DialogDescription>
              The post and its images will be removed permanently.
            </DialogDescription>
          </DialogHeader>

          {deletePost.isError ? (
            <Text variant="small" className="text-destructive">
              {deletePost.error.message}
            </Text>
          ) : null}

          <DialogFooter>
            <Button
              disabled={deletePost.isPending}
              variant="ghost"
              onPress={() => setIsDeleteOpen(false)}
            >
              <Text>Cancel</Text>
            </Button>
            <Button
              disabled={deletePost.isPending}
              variant="destructive"
              onPress={() => void remove()}
            >
              <Text>{deletePost.isPending ? "Deleting…" : "Delete Ask"}</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function PostDetailLoading() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <View className="mx-auto w-full max-w-3xl gap-5 px-5 py-6 sm:px-8">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-8 w-4/5" />
        <Skeleton className="h-52 w-full" />
      </View>
    </SafeAreaView>
  );
}
