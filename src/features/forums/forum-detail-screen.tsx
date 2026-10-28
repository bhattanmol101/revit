import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { Plus, Trash2, Users } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, View } from "react-native";

import type { PostWithDetails } from "@/api/posts";
import { AppHeader } from "@/components/navigation/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ContentSkeleton } from "@/components/ui/content-skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FeedbackState } from "@/components/ui/feedback-state";
import { Icon } from "@/components/ui/icon";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { ForumCoverDisplay } from "@/features/forums/forum-cover-display";
import { AskPostCard } from "@/features/posts/ask-post-card";
import { SharePostCard } from "@/features/posts/share-post-card";
import { routes } from "@/lib/routes";
import { useAuth } from "@/providers/auth-provider";
import { useEntity } from "@/queries/entities";
import {
  useDeleteForum,
  useForum,
  useForumMembership,
  useForumPosts,
} from "@/queries/forums";
import { useShareRatingScore } from "@/queries/shares";

export function ForumDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const forum = useForum(id, user?.id ?? "");
  const membership = useForumMembership(id, user?.id ?? "");
  const posts = useForumPosts(id);
  const deleteForum = useDeleteForum();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (forum.isLoading) return <LoadingState />;

  const forumData = forum.data;
  if (forum.isError || !forumData) {
    return <MissingState description={forum.error?.message} />;
  }

  const isOwner = forumData.owner_id === user?.id;
  const postItems = posts.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <Stack.Screen
        options={{
          header: () => (
            <AppHeader
              leading="back"
              onLeadingPress={() => router.replace(routes.forums)}
              title="Forums"
            />
          ),
        }}
      />
      <ScrollView contentContainerClassName="w-full gap-2 py-2 md:mx-auto md:max-w-2xl md:px-6 md:py-6">
        <View className="rounded-lg border border-border bg-card shadow-none">
          <ForumCoverDisplay
            forumId={forumData.id}
            forumName={forumData.name}
            imageUrl={forumData.coverImageUrl}
            className="rounded-t-md"
          />
          <View className="gap-2 p-2">
            <View className="gap-2">
              <Text className="font-semibold">{forumData.name}</Text>
              {forumData.description ? (
                <Text className="text-md">{forumData.description}</Text>
              ) : null}
            </View>
            {forumData.rules ? (
              <View className="gap-1 border-t border-border pt-2">
                <Text className="text-sm font-semibold">Rules</Text>
                <Text variant="muted" className="text-sm leading-5">
                  {forumData.rules}
                </Text>
              </View>
            ) : null}
            <View className="flex flex-row items-center justify-between border-t border-border pt-2">
              <View className="flex flex-row items-center gap-3">
                <Button
                  disabled={membership.isPending || isOwner}
                  size="sm"
                  variant={forumData.isMember ? "outline" : "default"}
                  onPress={() => membership.mutate(!forumData.isMember)}
                >
                  <Text>
                    {membership.isPending
                      ? "Updating…"
                      : isOwner
                        ? "Owner"
                        : forumData.isMember
                          ? "Leave"
                          : "Join"}
                  </Text>
                </Button>

                {forumData.isMember ? (
                  <Link href={routes.createForumPost(forumData.id)} asChild>
                    <Button className="self-start" size="sm">
                      <Icon as={Plus} className="size-4" />
                    </Button>
                  </Link>
                ) : null}

                {isOwner ? (
                  <Button
                    className="self-start"
                    size="sm"
                    variant="destructive"
                    onPress={() => setIsDeleteOpen(true)}
                  >
                    <Icon as={Trash2} className="size-4" />
                  </Button>
                ) : null}
              </View>
              <View className="flex-row items-center gap-1">
                <Icon as={Users} className="size-4 text-muted-foreground" />
                <Text variant="muted" className="text-xs">
                  {forumData.memberCount}
                </Text>
              </View>
            </View>
            {membership.isError ? (
              <Text className="text-destructive" variant="small">
                {membership.error.message}
              </Text>
            ) : null}
          </View>
        </View>

        <View className="gap-2">
          {!forumData.isMember ? (
            <Text variant="muted">
              Join to post, comment, or rate an Ask in this forum.
            </Text>
          ) : null}
          {posts.isLoading ? <PostsLoadingState /> : null}
          {posts.isError ? (
            <FeedbackState
              actionLabel="Retry"
              onAction={() => void posts.refetch()}
              title="Couldn’t load forum posts."
              variant="error"
            />
          ) : null}
          {!posts.isLoading && !posts.isError && postItems.length === 0 ? (
            <FeedbackState title="No forum posts yet" />
          ) : null}
          {postItems.length > 0 ? (
            <View className="gap-2">
              {postItems.map((post) => (
                <ForumPostCard key={post.id} post={post} />
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this forum?</DialogTitle>
            <DialogDescription>
              This permanently deletes its posts, comments, and memberships.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onPress={() => setIsDeleteOpen(false)}>
              <Text>Cancel</Text>
            </Button>
            <Button
              disabled={deleteForum.isPending}
              variant="destructive"
              onPress={() =>
                void deleteForum
                  .mutateAsync(forumData.id)
                  .then(() => router.replace(routes.forums))
                  .catch(() => {})
              }
            >
              <Text>
                {deleteForum.isPending ? "Deleting…" : "Delete forum"}
              </Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SafeAreaView>
  );
}

function ForumPostCard({ post }: { post: PostWithDetails }) {
  if (post.post_type === "ASK") return <AskPostCard post={post} />;

  return <ForumSharePostCard post={post} />;
}

function ForumSharePostCard({ post }: { post: PostWithDetails }) {
  const entity = useEntity(post.entity_id ?? "");
  const ratingScore = useShareRatingScore(post.id);

  if (entity.isLoading || ratingScore.isLoading) {
    return (
      <Card className="gap-3 rounded-lg p-5 shadow-none">
        <CardContent className="gap-3 px-0">
          <Skeleton className="h-9 w-44" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (
    entity.isError ||
    ratingScore.isError ||
    !entity.data ||
    ratingScore.data === null ||
    ratingScore.data === undefined
  ) {
    return (
      <FeedbackState
        description="This find’s rating is unavailable."
        title="Share post unavailable"
        variant="error"
      />
    );
  }

  return (
    <SharePostCard
      post={{ ...post, ratingScore: ratingScore.data }}
      entity={entity.data}
    />
  );
}

function LoadingState() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <Stack.Screen
        options={{
          header: () => (
            <AppHeader
              showAccountActions
              title="Forums"
              onBack={() => router.replace(routes.forums)}
            />
          ),
        }}
      />
      <View className="px-6 py-6 md:mx-auto md:w-full md:max-w-2xl">
        <ContentSkeleton rows={3} />
      </View>
    </SafeAreaView>
  );
}

function PostsLoadingState() {
  return <ContentSkeleton rows={2} />;
}

function MissingState({ description }: { description?: string }) {
  return (
    <SafeAreaView
      className="flex-1 items-center justify-center gap-2 bg-background px-6"
      edges={["bottom"]}
    >
      <Stack.Screen
        options={{
          header: () => (
            <AppHeader
              showAccountActions
              title="Forums"
              onBack={() => router.replace(routes.forums)}
            />
          ),
        }}
      />
      <Text variant="h2">Forum unavailable</Text>
      <Text variant="muted" className="text-center">
        {description ?? "This forum may have been deleted."}
      </Text>
    </SafeAreaView>
  );
}
