import { Link, usePathname } from "expo-router";
import { TabList, TabSlot, Tabs, TabTrigger } from "expo-router/ui";
import {
  Bell,
  Bookmark,
  Compass,
  House,
  Plus,
  UsersRound,
} from "lucide-react-native";
import { Pressable, View } from "react-native";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/use-theme";
import { routes } from "@/lib/routes";
import { useAuth } from "@/providers/auth-provider";
import { useUnreadNotificationCount } from "@/queries/notifications";

const mainItems = [
  { href: routes.home, Icon: House, name: "index", title: "Home" },
  { href: routes.discover, Icon: Compass, name: "discover", title: "Discover" },
  { href: routes.forums, Icon: UsersRound, name: "forums", title: "Forums" },
  { href: routes.picks, Icon: Bookmark, name: "picks", title: "Picks" },
] as const;

export default function MainTabs() {
  const pathname = usePathname();
  const title =
    mainItems.find((item) => item.href === pathname)?.title ??
    (pathname === routes.create ? "Create" : "Profile");

  return (
    <Tabs className="flex-1 bg-background">
      <TabSlot style={{ flex: 1, marginTop: 56 }} />

      <View className="absolute left-0 right-0 top-0 h-14 flex-row items-center justify-between border-b border-border bg-card px-5">
        <Text className="text-xl font-semibold">{title}</Text>
        <HeaderActions />
      </View>

      <TabList
        className="hidden"
        style={{ flexDirection: "column", justifyContent: "flex-start" }}
      >
        <Text className="px-2 pb-6 text-xl font-bold">Revit</Text>

        {mainItems.slice(0, 2).map(({ href, Icon, name, title: itemTitle }) => {
          const isActive = pathname === href;

          return (
            <TabTrigger
              key={name}
              asChild
              href={href}
              name={name}
              style={{ justifyContent: "flex-start" }}
            >
              <Pressable
                accessibilityLabel={`Open ${itemTitle}`}
                className={`mb-1 h-10 flex-row items-center justify-start gap-3 rounded-md px-3 active:bg-selected ${
                  isActive ? "bg-selected" : ""
                }`}
              >
                <Icon
                  className={
                    isActive ? "text-primary" : "text-muted-foreground"
                  }
                  size={16}
                  strokeWidth={2}
                />
                <Text
                  className={`text-sm ${
                    isActive
                      ? "font-semibold text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {itemTitle}
                </Text>
              </Pressable>
            </TabTrigger>
          );
        })}

        <TabTrigger
          asChild
          href={routes.create}
          name="create"
          style={{ justifyContent: "flex-start" }}
        >
          <Pressable
            accessibilityLabel="Create a new post"
            className={`h-10 flex-row items-center justify-start gap-2 rounded-md bg-primary px-3 active:bg-primary/85 ${
              pathname === routes.create ? "opacity-85" : ""
            }`}
          >
            <Plus
              className="text-primary-foreground"
              size={16}
              strokeWidth={2.5}
            />
            <Text className="text-sm font-semibold text-primary-foreground">
              Create
            </Text>
          </Pressable>
        </TabTrigger>

        {mainItems.slice(2).map(({ href, Icon, name, title: itemTitle }) => {
          const isActive = pathname === href;

          return (
            <TabTrigger
              key={name}
              asChild
              href={href}
              name={name}
              style={{ justifyContent: "flex-start" }}
            >
              <Pressable
                accessibilityLabel={`Open ${itemTitle}`}
                className={`mb-1 h-10 flex-row items-center justify-start gap-3 rounded-md px-3 active:bg-selected ${
                  isActive ? "bg-selected" : ""
                }`}
              >
                <Icon
                  className={
                    isActive ? "text-primary" : "text-muted-foreground"
                  }
                  size={16}
                  strokeWidth={2}
                />
                <Text
                  className={`text-sm ${
                    isActive
                      ? "font-semibold text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {itemTitle}
                </Text>
              </Pressable>
            </TabTrigger>
          );
        })}

        <View className="flex-1" />

        <TabTrigger asChild href={routes.profile} name="profile">
          <Pressable className="hidden" accessibilityLabel="Open profile" />
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

function HeaderActions() {
  const theme = useTheme();
  const { profile, user } = useAuth();
  const unread = useUnreadNotificationCount(user?.id);
  const initials = (profile?.display_name ?? "You")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <View className="flex-row items-center gap-2">
      <Link href={routes.activity} asChild>
        <Pressable
          accessibilityLabel="Open activity"
          className="relative size-11 items-center justify-center rounded-md border border-border bg-card active:bg-selected"
        >
          <Bell color={theme.text} size={16} strokeWidth={2} />
          {(unread.data ?? 0) > 0 ? (
            <View className="absolute right-1 top-1 size-1.5 rounded-full bg-primary" />
          ) : null}
        </Pressable>
      </Link>
      <Link href={routes.profile} asChild>
        <Pressable
          accessibilityLabel="Open profile"
          className="size-11 items-center justify-center"
        >
          <Avatar alt="Your profile" className="size-8 border border-border">
            {profile?.avatar_url ? (
              <AvatarImage source={{ uri: profile.avatar_url }} />
            ) : null}
            <AvatarFallback>
              <Text className="text-[11px] font-semibold">{initials}</Text>
            </AvatarFallback>
          </Avatar>
        </Pressable>
      </Link>
    </View>
  );
}
