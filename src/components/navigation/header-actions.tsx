import { Link } from "expo-router";
import { Bell } from "lucide-react-native";
import { View } from "react-native";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useUnreadNotificationCount } from "@/queries/notifications";

export function HeaderActions({ className }: { className?: string }) {
  const { profile, user } = useAuth();
  const unread = useUnreadNotificationCount(user?.id);
  const initials = (profile?.display_name ?? "You")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <View className={cn("flex-row items-center gap-2", className)}>
      <Link href={routes.activity} asChild>
        <Button
          accessibilityLabel="Open activity"
          className="relative border border-border bg-card"
          size="icon"
          variant="ghost"
        >
          <Icon as={Bell} className="size-4 text-card-foreground" />
          {(unread.data ?? 0) > 0 ? (
            <View className="absolute right-1 top-1 size-1.5 rounded-full bg-primary" />
          ) : null}
        </Button>
      </Link>
      <Link href={routes.profile} asChild>
        <Button accessibilityLabel="Open profile" size="icon" variant="ghost">
          <Avatar alt="Your profile" className="size-8 border border-border">
            {profile?.avatar_url ? (
              <AvatarImage source={{ uri: profile.avatar_url }} />
            ) : null}
            <AvatarFallback>
              <Text className="text-[11px] font-semibold">{initials}</Text>
            </AvatarFallback>
          </Avatar>
        </Button>
      </Link>
    </View>
  );
}
