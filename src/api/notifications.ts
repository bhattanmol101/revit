import { supabase } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";

import { normalizeApiError } from "./errors";
import { runApiRequest } from "./request";

const NOTIFICATION_PAGE_SIZE = 30;

export type ActivityNotification = Tables<"notifications"> & {
  actor: Pick<Tables<"profiles">, "display_name" | "username">;
};

type NotificationRow = Tables<"notifications"> & {
  actor: ActivityNotification["actor"] | null;
};

export function getNotifications(
  recipientId: string,
  offset = 0,
): Promise<ActivityNotification[]> {
  return runApiRequest(
    async (signal) => {
      const { data, error } = await supabase
        .from("notifications")
        .select(
          "id, recipient_id, actor_id, notification_type, post_id, comment_id, forum_id, created_at, read_at, actor:profiles!notifications_actor_id_fkey(display_name, username)",
        )
        .eq("recipient_id", recipientId)
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .range(offset, offset + NOTIFICATION_PAGE_SIZE - 1)
        .abortSignal(signal);

      if (error) {
        throw normalizeApiError(error, "We could not load your activity.");
      }

      return (data as NotificationRow[]).flatMap((notification) =>
        notification.actor
          ? [{ ...notification, actor: notification.actor }]
          : [],
      );
    },
    { retries: 1 },
  );
}

export function getUnreadNotificationCount(
  recipientId: string,
): Promise<number> {
  return runApiRequest(
    async (signal) => {
      const { count, error } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("recipient_id", recipientId)
        .is("read_at", null)
        .abortSignal(signal);

      if (error) {
        throw normalizeApiError(error, "We could not load your activity.");
      }

      return count ?? 0;
    },
    { retries: 1 },
  );
}

export function markNotificationsRead(recipientId: string): Promise<void> {
  return runApiRequest(async (signal) => {
    const { error } = await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("recipient_id", recipientId)
      .is("read_at", null)
      .abortSignal(signal);

    if (error) {
      throw normalizeApiError(error, "We could not mark your activity read.");
    }
  });
}
