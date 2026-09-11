import { Link, Tabs } from "expo-router";
import {
  Bell,
  Bookmark,
  Compass,
  House,
  type LucideIcon,
  Plus,
  UserRound,
  UsersRound,
} from "lucide-react-native";
import { type ColorValue, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/use-theme";
import { routes } from "@/lib/routes";
import { useAuth } from "@/providers/auth-provider";
import { useUnreadNotificationCount } from "@/queries/notifications";

export default function MainTabs() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerRight: HeaderActions,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: theme.backgroundElement,
        },
        headerTintColor: theme.text,
        headerTitle: "Revit",
        headerTitleStyle: { fontSize: 20, fontWeight: "700" },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700", marginTop: 2 },
        tabBarStyle: {
          backgroundColor: theme.backgroundElement,
          borderTopColor: theme.border,
          height: 58 + bottomPadding,
          paddingBottom: bottomPadding,
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarIcon: tabIcon(House) }}
      />
      <Tabs.Screen
        name="discover"
        options={{ title: "Discover", tabBarIcon: tabIcon(Compass) }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ size }) => (
            <View className="-mt-4 size-11 items-center justify-center rounded-full bg-primary shadow-sm shadow-primary/20">
              <Plus color="white" size={size + 4} strokeWidth={2.5} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="forums"
        options={{ title: "Forums", tabBarIcon: tabIcon(UsersRound) }}
      />
      <Tabs.Screen
        name="picks"
        options={{ title: "Picks", tabBarIcon: tabIcon(Bookmark) }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
          title: "Profile",
          tabBarIcon: tabIcon(UserRound),
        }}
      />
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
    <View className="mr-3 flex-row items-center gap-2">
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

function tabIcon(IconComponent: LucideIcon) {
  return ({ color, size }: { color: ColorValue; size: number }) => (
    <IconComponent color={String(color)} size={size} strokeWidth={2.2} />
  );
}
