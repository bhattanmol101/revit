import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";

import type { PostWithDetails } from "@/api/posts";
import { AppHeader } from "@/components/navigation/app-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { CommentSection } from "@/features/comments/comment-section";
import { ProfileMessageScreen } from "@/features/profile/profile-state-screen";
import { routes } from "@/lib/routes";
import { useAuth } from "@/providers/auth-provider";
import { useTopLevelComments } from "@/queries/comments";
import { useDeletePost, usePost, useUpdateAskPost } from "@/queries/posts";
import { useEntity } from "@/queries/entities";
import { useShareRatingScore } from "@/queries/shares";

import { AskPostCard } from "./ask-post-card";
import { SharePostCard } from "./share-post-card";

export function PostDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const postId = Array.isArray(params.id) ? params.id[0] : (params.id ?? "");
  const post = usePost(postId);

  if (post.isLoading) {
    return <PostDetailLoading />;
  }

  if (post.isError) {
    return (
      <PostDetailMessage
        title="Post unavailable"
        description="We couldn’t load this post. Check your connection and try again."
        action={() => void post.refetch()}
      />
    );
  }

  if (!post.data) {
    return (
      <PostDetailMessage
        title="Post not found"
        description="This post may have been removed or is no longer available."
      />
    );
  }

  if (post.data.post_type === "SHARE" && post.data.forum_id)
    return <ForumSharePostDetail post={post.data} />;

  if (post.data.post_type === "SHARE")
    return <SharePostDetail post={post.data} />;

  return (
    <AskPostDetail
      isRefetching={post.isRefetching}
      post={post.data}
      refetch={post.refetch}
    />
  );
}

function ForumSharePostDetail({ post }: { post: PostWithDetails }) {
  const entity = useEntity(post.entity_id ?? "");
  const ratingScore = useShareRatingScore(post.id);
  const comments = useTopLevelComments(post.id);

  if (entity.isLoading || ratingScore.isLoading)
    return <PostDetailLoading />;
  if (entity.isError || ratingScore.isError || !entity.data) {
    return (
      <PostDetailMessage
        title="Share post unavailable"
        description="We couldn’t load this find."
        action={() =>
          void Promise.all([entity.refetch(), ratingScore.refetch()])
        }
      />
    );
  }

  if (ratingScore.data === null || ratingScore.data === undefined) {
    return (
      <PostDetailMessage
        title="Share post unavailable"
        description="This rating may have been removed or is no longer available."
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <Stack.Screen
        options={{
          header: () => (
            <AppHeader
              showAccountActions
              title="Post"
              onBack={goBackFromPost}
            />
          ),
        }}
      />
      <ScrollView contentContainerClassName="w-full gap-4 md:mx-auto md:max-w-3xl md:gap-6 md:px-6 md:py-6">
        <SharePostCard
          isDetail
          post={{ ...post, ratingScore: ratingScore.data }}
          entity={entity.data}
        />
        <CommentSection comments={comments} postId={post.id} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SharePostDetail({ post }: { post: PostWithDetails }) {
  const entity = useEntity(post.entity_id ?? "");
  const ratingScore = useShareRatingScore(post.id);
  const comments = useTopLevelComments(post.id);
  const score = ratingScore.data;

  if (entity.isLoading || ratingScore.isLoading)
    return <PostDetailLoading />;

  if (entity.isError || ratingScore.isError) {
    return (
      <PostDetailMessage
        title="Share post unavailable"
        description="We couldn’t load this rating. Check your connection and try again."
        action={() =>
          void Promise.all([entity.refetch(), ratingScore.refetch()])
        }
      />
    );
  }

  if (!entity.data || score === null || score === undefined) {
    return (
      <PostDetailMessage
        title="Share post unavailable"
        description="This rating may have been removed or is no longer available."
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <Stack.Screen
        options={{
          header: () => (
            <AppHeader
              showAccountActions
              title="Post"
              onBack={goBackFromPost}
            />
          ),
        }}
      />
      <ScrollView
        contentContainerClassName="w-full gap-4 md:mx-auto md:max-w-3xl md:gap-6 md:px-6 md:py-6"
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() =>
              void Promise.all([
                entity.refetch(),
                ratingScore.refetch(),
                comments.refetch(),
              ])
            }
          />
        }
      >
        <SharePostCard
          isDetail
          post={{ ...post, ratingScore: score }}
          entity={entity.data}
        />
        <CommentSection comments={comments} postId={post.id} />
      </ScrollView>
    </SafeAreaView>
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
  const comments = useTopLevelComments(post.id);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <Stack.Screen
        options={{
          header: () => (
            <AppHeader
              showAccountActions
              title="Post"
              onBack={goBackFromPost}
            />
          ),
        }}
      />
      <ScrollView
        contentContainerClassName="w-full gap-4 md:mx-auto md:max-w-3xl md:gap-6 md:px-6 md:py-6"
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => void Promise.all([refetch(), comments.refetch()])}
          />
        }
      >
        <AskPostCard isDetail post={post} />
        {isAuthor ? <AuthorActions post={post} /> : null}
        <CommentSection comments={comments} postId={post.id} />
      </ScrollView>
    </SafeAreaView>
  );
}

function AuthorActions({ post }: { post: PostWithDetails }) {
  const updatePost = useUpdateAskPost(post.id, post.author_id);
  const deletePost = useDeletePost(post.author_id);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [body, setBody] = useState(post.body ?? "");
  const canSave =
    body.trim().length >= 1 &&
    body.trim().length <= 2000 &&
    !updatePost.isPending;

  const openEditor = () => {
    setBody(post.body ?? "");
    updatePost.reset();
    setIsEditOpen(true);
  };

  const save = async () => {
    if (!canSave) return;

    try {
      await updatePost.mutateAsync({ body });
      setIsEditOpen(false);
    } catch {
      // The mutation error stays visible in the editor for a retry.
    }
  };

  const remove = async () => {
    try {
      await deletePost.mutateAsync(post.id);
      setIsDeleteOpen(false);
      router.replace(
        post.forum_id ? routes.forum(post.forum_id) : routes.profile,
      );
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
              Update the details. Existing images keep their order.
            </DialogDescription>
          </DialogHeader>

          <View className="gap-4">
            <View className="gap-2">
              <Text variant="small">Details (optional)</Text>
              <Textarea
                editable={!updatePost.isPending}
                maxLength={2000}
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
              variant="secondary"
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
              variant="secondary"
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
      <Stack.Screen
        options={{
          header: () => (
            <AppHeader
              showAccountActions
              title="Post"
              onBack={goBackFromPost}
            />
          ),
        }}
      />
      <View className="w-full gap-5 px-4 md:mx-auto md:max-w-3xl md:px-6 md:py-6">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-8 w-4/5" />
        <Skeleton className="h-52 w-full" />
      </View>
    </SafeAreaView>
  );
}

function PostDetailMessage({
  action,
  description,
  title,
}: {
  action?: () => void;
  description: string;
  title: string;
}) {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <Stack.Screen
        options={{
          header: () => (
            <AppHeader
              showAccountActions
              title="Post"
              onBack={goBackFromPost}
            />
          ),
        }}
      />
      <ProfileMessageScreen
        action={action}
        description={description}
        title={title}
      />
    </SafeAreaView>
  );
}

function goBackFromPost() {
  if (router.canGoBack()) {
    router.back();
    return;
  }

  router.replace(routes.home);
}
