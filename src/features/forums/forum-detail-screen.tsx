import { Image } from "expo-image";
import { Link, router, useLocalSearchParams } from "expo-router";
import { MessageSquare, Users } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { routes } from "@/lib/routes";
import { useAuth } from "@/providers/auth-provider";
import {
  useDeleteForum,
  useForum,
  useForumMembership,
  useForumPosts,
} from "@/queries/forums";

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
      <ScrollView contentContainerClassName="mx-auto w-full max-w-2xl gap-4 px-3 py-4 sm:px-6">
        <View className="gap-2 rounded-lg border border-border bg-card p-3 shadow-none">
          {forumData.coverImageUrl ? (
            <Image
              accessibilityLabel={`${forumData.name} cover image`}
              className="h-44 w-full rounded-md bg-muted"
              contentFit="cover"
              source={forumData.coverImageUrl}
            />
          ) : null}
          <View className="flex-row items-start justify-between gap-3">
            <View className="min-w-0 flex-1 gap-1">
              <Text variant="h1" className="text-left text-2xl">
                {forumData.name}
              </Text>
              <Text variant="muted">/{forumData.slug}</Text>
            </View>
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
          </View>
          {forumData.description ? (
            <Text className="leading-5">{forumData.description}</Text>
          ) : null}
          <View className="flex-row items-center gap-1">
            <Icon as={Users} className="size-4 text-muted-foreground" />
            <Text variant="muted" className="text-xs">
              {forumData.memberCount}{" "}
              {forumData.memberCount === 1 ? "member" : "members"}
            </Text>
          </View>
          {forumData.rules ? (
            <View className="gap-1 border-t border-border pt-2">
              <Text className="text-sm font-semibold">Rules</Text>
              <Text variant="muted" className="text-sm leading-5">
                {forumData.rules}
              </Text>
            </View>
          ) : null}
          {isOwner ? (
            <Button
              className="self-start"
              size="sm"
              variant="destructive"
              onPress={() => setIsDeleteOpen(true)}
            >
              <Text>Delete forum</Text>
            </Button>
          ) : null}
          {membership.isError ? (
            <Text className="text-destructive" variant="small">
              {membership.error.message}
            </Text>
          ) : null}
        </View>

        <View className="gap-2">
          <Text variant="h2" className="text-xl">
            Forum posts
          </Text>
          {forumData.isMember ? (
            <Link href={routes.createForumPost(forumData.id)} asChild>
              <Button className="self-start" size="sm">
                <Text>New post</Text>
              </Button>
            </Link>
          ) : null}
          {!forumData.isMember ? (
            <Text variant="muted">
              Join to post, comment, or rate an Ask in this forum.
            </Text>
          ) : null}
          {posts.isLoading ? <PostsLoadingState /> : null}
          {posts.isError ? (
            <Card className="gap-3 border-destructive/40 py-3 shadow-none">
              <CardContent className="gap-3 px-3">
                <Text className="text-destructive" variant="small">
                  {posts.error.message}
                </Text>
                <Button
                  className="self-start"
                  size="sm"
                  variant="outline"
                  onPress={() => void posts.refetch()}
                >
                  <Text>Try again</Text>
                </Button>
              </CardContent>
            </Card>
          ) : null}
          {!posts.isLoading && !posts.isError && postItems.length === 0 ? (
            <Card className="py-4 shadow-none">
              <CardContent>
                <Text variant="muted">No forum posts yet.</Text>
              </CardContent>
            </Card>
          ) : null}
          {postItems.map((post) => (
            <Link key={post.id} href={routes.post(post.id)} asChild>
              <Card className="gap-2 py-3 shadow-none">
                <CardContent className="gap-1">
                  <View className="flex-row items-center gap-1">
                    <Icon as={MessageSquare} className="size-4 text-primary" />
                    <Text className="text-xs font-semibold text-primary">
                      {post.post_type}
                    </Text>
                  </View>
                  <Text className="font-semibold">
                    {post.title || post.author.display_name}
                  </Text>
                  {post.body ? (
                    <Text variant="muted" numberOfLines={3}>
                      {post.body}
                    </Text>
                  ) : null}
                </CardContent>
              </Card>
            </Link>
          ))}
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
            <Button variant="ghost" onPress={() => setIsDeleteOpen(false)}>
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

function LoadingState() {
  return (
    <SafeAreaView
      className="flex-1 items-center justify-center gap-2 bg-background"
      edges={["bottom"]}
    >
      <ActivityIndicator />
      <Text variant="muted">Loading forum…</Text>
    </SafeAreaView>
  );
}

function PostsLoadingState() {
  return (
    <View className="flex-row items-center gap-2 py-3">
      <ActivityIndicator />
      <Text variant="muted">Loading forum posts…</Text>
    </View>
  );
}

function MissingState({ description }: { description?: string }) {
  return (
    <SafeAreaView
      className="flex-1 items-center justify-center gap-2 bg-background px-6"
      edges={["bottom"]}
    >
      <Text variant="h2">Forum unavailable</Text>
      <Text variant="muted" className="text-center">
        {description ?? "This forum may have been deleted."}
      </Text>
    </SafeAreaView>
  );
}
