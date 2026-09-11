import { type Href, Link, usePathname } from "expo-router";
import {
  Bookmark,
  Compass,
  House,
  Plus,
  UsersRound,
} from "lucide-react-native";
import type { ReactNode } from "react";
import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/text";
import { routes } from "@/lib/routes";

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

  if (!enabled) return children;

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 pb-16 md:ml-44 md:pb-0">{children}</View>
      <View className="absolute bottom-0 left-0 top-0 hidden w-44 border-r border-border bg-card px-2 py-4 md:flex">
        <Text className="px-2 pb-6 text-xl font-bold">Revit</Text>
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
            accessibilityLabel="Create a new post"
            className={`h-10 flex-row items-center gap-2 rounded-md bg-primary px-3 active:bg-primary/85 ${isSectionActive(pathname, routes.create) ? "opacity-85" : ""}`}
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
      <View className="absolute bottom-0 left-0 right-0 h-16 flex-row border-t border-border bg-card md:hidden">
        {mobileNavigationItems.map(({ href, Icon, title }) => {
          const active = isSectionActive(pathname, href);
          return (
            <Link key={title} href={href} asChild>
              <Pressable
                accessibilityLabel={`Open ${title}`}
                className="flex-1 items-center justify-center gap-1"
              >
                <Icon
                  className={active ? "text-primary" : "text-muted-foreground"}
                  size={18}
                  strokeWidth={2.2}
                />
                <Text
                  className={`text-[10px] ${active ? "font-semibold text-primary" : "text-muted-foreground"}`}
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
        className={`mb-1 h-10 flex-row items-center gap-3 rounded-md px-3 active:bg-selected ${active ? "bg-selected" : ""}`}
      >
        <Icon
          className={active ? "text-primary" : "text-muted-foreground"}
          size={16}
          strokeWidth={2}
        />
        <Text
          className={`text-sm ${active ? "font-semibold text-primary" : "text-muted-foreground"}`}
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
