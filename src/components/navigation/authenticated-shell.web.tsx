import { type Href, Link, usePathname } from "expo-router";
import { Image } from "expo-image";
import {
  Bookmark,
  ChevronRight,
  Compass,
  House,
  Plus,
  PlusCircle,
  UsersRound,
} from "lucide-react-native";
import type { ReactNode } from "react";
import { Pressable, View } from "react-native";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { routes } from "@/lib/routes";
import { useAuth } from "@/providers/auth-provider";

const navigationItems = [
  { href: routes.home, Icon: House, title: "Home" },
  { href: routes.discover, Icon: Compass, title: "Discover" },
  { href: routes.forums, Icon: UsersRound, title: "Forums" },
  { href: routes.picks, Icon: Bookmark, title: "Picks" },
] as const;

const mobileNavigationItems = [
  navigationItems[0],
  navigationItems[1],
  { href: routes.create, Icon: Plus, title: "Create" },
  navigationItems[2],
  navigationItems[3],
] as const;

export function AuthenticatedShell({
  children,
  enabled,
}: {
  children: ReactNode;
  enabled: boolean;
}) {
  const pathname = usePathname();
  const { profile } = useAuth();

  if (!enabled) return children;

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 pb-16 md:ml-64 md:pb-0">{children}</View>
      <View className="absolute bottom-0 left-0 top-0 hidden w-64 border-r border-border bg-card px-2 py-5 md:flex">
        <View className="mb-10 px-2">
          <Image
            source={require("../../../assets/expo.icon/Assets/revit-logo.svg")}
            style={{ width: 36, height: 36 }}
            contentFit="contain"
            accessibilityLabel="Revit"
          />
        </View>

        <View className="gap-1">
          {navigationItems.slice(0, 2).map(({ href, Icon, title }) => (
            <NavigationItem
              key={title}
              href={href}
              Icon={Icon}
              pathname={pathname}
              title={title}
            />
          ))}
          <Link href={routes.create} asChild>
            <Pressable
              accessibilityLabel="Create"
              accessibilityRole="link"
              className={`h-11 mb-1 flex-row items-center gap-1 rounded-lg px-3 active:bg-selected hover:bg-selected bg-blue-800 ${isSectionActive(pathname, routes.create) ? "bg-selected" : ""}`}
            >
              <PlusCircle className="text-white" size={20} />
              <Text className="ml-2 text-md font-medium">Create on revit</Text>
            </Pressable>
          </Link>
          {navigationItems.slice(2).map(({ href, Icon, title }) => (
            <NavigationItem
              key={title}
              href={href}
              Icon={Icon}
              pathname={pathname}
              title={title}
            />
          ))}
        </View>

        <View className="mt-auto border-t border-border pt-2">
          <Link href={routes.profile} asChild>
            <Pressable
              accessibilityLabel="Open profile"
              accessibilityRole="link"
              className="flex-row items-center gap-2.5 rounded-lg px-2 py-3 active:opacity-75 hover:bg-selected"
            >
              <Avatar
                alt="Your profile"
                className="size-9 border border-border"
              >
                {profile?.avatar_url ? (
                  <AvatarImage source={{ uri: profile.avatar_url }} />
                ) : null}
                <AvatarFallback>
                  <Text className="text-xs font-semibold">
                    {getInitials(profile?.display_name ?? "You")}
                  </Text>
                </AvatarFallback>
              </Avatar>
              <View className="min-w-0 flex-1">
                <Text className="text-sm font-semibold" numberOfLines={1}>
                  {profile?.display_name ?? "Your profile"}
                </Text>
                {profile?.username ? (
                  <Text className="text-xs" numberOfLines={1} variant="muted">
                    @{profile.username}
                  </Text>
                ) : null}
              </View>
              <ChevronRight
                className="text-muted-foreground"
                size={16}
                strokeWidth={2}
              />
            </Pressable>
          </Link>
        </View>
      </View>
      <View className="absolute bottom-0 left-0 right-0 h-16 flex-row border-t border-border bg-card md:hidden">
        {mobileNavigationItems.map(({ href, Icon, title }) => {
          const active = isSectionActive(pathname, href);
          return (
            <Link key={title} href={href} asChild>
              <Pressable
                accessibilityLabel={`Open ${title}`}
                accessibilityRole="link"
                className="flex-1 items-center justify-center gap-1"
              >
                <Icon
                  className={
                    active
                      ? "text-primary dark:text-foreground"
                      : "text-muted-foreground"
                  }
                  size={18}
                  strokeWidth={2.2}
                />
                <Text
                  className={`text-[10px] ${active ? "font-semibold text-primary dark:text-foreground" : "text-muted-foreground"}`}
                >
                  {title}
                </Text>
              </Pressable>
            </Link>
          );
        })}
      </View>
    </View>
  );
}

function NavigationItem({
  href,
  Icon,
  pathname,
  title,
}: {
  href: Href;
  Icon: typeof House;
  pathname: string;
  title: string;
}) {
  const active = isSectionActive(pathname, String(href));

  return (
    <Link href={href} asChild>
      <Pressable
        accessibilityLabel={`Open ${title}`}
        accessibilityRole="link"
        className={`relative mb-1 h-11 flex-row items-center gap-3 rounded-lg px-3 active:bg-selected hover:bg-selected ${active ? "bg-selected" : ""}`}
      >
        {active ? (
          <View className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-primary" />
        ) : null}
        <Icon
          className={
            active
              ? "text-primary dark:text-foreground"
              : "text-muted-foreground"
          }
          size={17}
          strokeWidth={2.1}
        />
        <Text
          className={`text-sm ${active ? "font-semibold text-primary dark:text-foreground" : "text-muted-foreground"}`}
        >
          {title}
        </Text>
      </Pressable>
    </Link>
  );
}

function isSectionActive(pathname: string, href: string) {
  if (href === routes.home) return pathname === routes.home;
  if (href === routes.create) {
    return pathname === routes.create || pathname.startsWith("/create/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
