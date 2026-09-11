import { Link } from "expo-router";
import { useEffect } from "react";
import { Pressable, ScrollView, View } from "react-native";

import type { ActivityNotification } from "@/api/notifications";
import { FeedbackState } from "@/components/ui/feedback-state";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { routes } from "@/lib/routes";
import { useAuth } from "@/providers/auth-provider";
import {
  useMarkNotificationsRead,
  useNotifications,
} from "@/queries/notifications";

export default function ActivityScreen() {
  const { user } = useAuth();
  const notifications = useNotifications(user?.id);
  const markRead = useMarkNotificationsRead(user?.id);
  const markReadPending = markRead.isPending;
  const markReadNow = markRead.mutate;
  const hasUnread = notifications.data?.some(
    (notification) => notification.read_at === null,
  );

  useEffect(() => {
    if (hasUnread && !markReadPending) markReadNow();
  }, [hasUnread, markReadNow, markReadPending]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <ScrollView contentContainerClassName="mx-auto w-full max-w-2xl gap-3 px-3 py-4 sm:px-6">
        <View className="gap-1 pb-1">
          <Text variant="h1" className="text-left text-2xl">
            Activity
          </Text>
          <Text variant="muted">Your latest social activity.</Text>
        </View>
        {notifications.isLoading ? (
          <Text variant="muted">Loading activity…</Text>
        ) : null}
        {notifications.isError ? (
          <FeedbackState
            actionLabel="Retry"
            onAction={() => void notifications.refetch()}
            title="Couldn’t load activity."
            variant="error"
          />
        ) : null}
        {notifications.data?.length === 0 ? <EmptyActivity /> : null}
        {notifications.data?.map((notification) => (
          <ActivityItem key={notification.id} notification={notification} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function EmptyActivity() {
  return (
    <FeedbackState
      description="Follows, ratings, comments, replies, and forum activity will appear here."
      title="Nothing new yet"
    />
  );
}

function ActivityItem({
  notification,
}: {
  notification: ActivityNotification;
}) {
  const destination = notification.post_id
    ? routes.post(notification.post_id)
    : notification.forum_id
      ? routes.forum(notification.forum_id)
      : routes.user(notification.actor.username);

  return (
    <Link href={destination} asChild>
      <Pressable className="min-h-12 flex-row items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 active:bg-selected">
        <View className="size-8 items-center justify-center rounded-full bg-selected">
          <Text className="font-bold text-primary">
            {notification.actor.display_name.slice(0, 1).toUpperCase()}
          </Text>
        </View>
        <View className="flex-1 gap-1">
          <Text className="text-sm leading-5">
            <Text className="font-semibold">
              {notification.actor.display_name}
            </Text>{" "}
            {activityMessage(notification)}
          </Text>
          <Text variant="muted" className="text-xs">
            {formatRelativeTime(notification.created_at)}
          </Text>
        </View>
        {notification.read_at === null ? (
          <View className="mt-2 size-2 rounded-full bg-primary" />
        ) : null}
      </Pressable>
    </Link>
  );
}

function activityMessage(notification: ActivityNotification) {
  switch (notification.notification_type) {
    case "FOLLOW":
      return "started following you.";
    case "ASK_RATING":
      return "rated your Ask.";
    case "COMMENT":
      return "commented on your post.";
    case "REPLY":
      return "replied to your comment.";
    case "FORUM_JOIN":
      return "joined your forum.";
    case "FORUM_POST":
      return "posted in your forum.";
  }
}

function formatRelativeTime(value: string) {
  const seconds = Math.max(
    0,
    Math.floor((Date.now() - Date.parse(value)) / 1000),
  );
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86_400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86_400)}d`;
}
