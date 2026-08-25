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
import { type ColorValue, Pressable } from "react-native";

import { useTheme } from "@/hooks/use-theme";
import { routes } from "@/lib/routes";

export default function MainTabs() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerRight: ActivityButton,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        headerTitle: "Ratings",
        headerTitleStyle: { fontSize: 20, fontWeight: "800" },
        tabBarActiveBackgroundColor: theme.backgroundSelected,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarItemStyle: {
          borderRadius: 14,
          marginHorizontal: 12,
          marginVertical: 3,
        },
        tabBarLabelPosition: "beside-icon",
        tabBarLabelStyle: { fontSize: 14, fontWeight: "700" },
        tabBarPosition: "left",
        tabBarStyle: {
          backgroundColor: theme.backgroundElement,
          borderRightColor: theme.border,
          paddingTop: 18,
          width: 252,
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
        options={{ title: "Create", tabBarIcon: tabIcon(Plus) }}
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
        options={{ title: "Profile", tabBarIcon: tabIcon(UserRound) }}
      />
    </Tabs>
  );
}

function tabIcon(IconComponent: LucideIcon) {
  return ({ color, size }: { color: ColorValue; size: number }) => (
    <IconComponent color={String(color)} size={size} strokeWidth={2.2} />
  );
}

function ActivityButton() {
  const theme = useTheme();
  return (
    <Link href={routes.activity} asChild>
      <Pressable
        accessibilityLabel="Open activity"
        className="mr-3 rounded-md border border-border bg-card p-2 active:bg-secondary"
      >
        <Bell color={theme.text} size={19} />
      </Pressable>
    </Link>
  );
}
