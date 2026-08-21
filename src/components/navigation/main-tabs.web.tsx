import { Link, Tabs } from "expo-router";
import { Bell, Bookmark, Compass, House, Plus, UserRound, UsersRound } from "lucide-react-native";
import { Pressable } from "react-native";

import { useTheme } from "@/hooks/use-theme";
import { routes } from "@/lib/routes";

export default function MainTabs() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: "Ratings",
        headerRight: ActivityButton,
        headerStyle: { backgroundColor: theme.backgroundElement },
        headerTintColor: theme.text,
        tabBarPosition: "left",
        tabBarLabelPosition: "beside-icon",
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: { backgroundColor: theme.backgroundElement, width: 248 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color, size }) => <House color={color} size={size} /> }} />
      <Tabs.Screen name="discover" options={{ title: "Discover", tabBarIcon: ({ color, size }) => <Compass color={color} size={size} /> }} />
      <Tabs.Screen name="create" options={{ title: "Create", tabBarIcon: ({ color, size }) => <Plus color={color} size={size} /> }} />
      <Tabs.Screen name="forums" options={{ title: "Forums", tabBarIcon: ({ color, size }) => <UsersRound color={color} size={size} /> }} />
      <Tabs.Screen name="picks" options={{ title: "Picks", tabBarIcon: ({ color, size }) => <Bookmark color={color} size={size} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color, size }) => <UserRound color={color} size={size} /> }} />
    </Tabs>
  );
}

function ActivityButton() {
  const theme = useTheme();

  return (
    <Link href={routes.activity} asChild>
      <Pressable accessibilityLabel="Open activity" className="mr-3 rounded-full p-2">
        <Bell color={theme.text} size={20} />
      </Pressable>
    </Link>
  );
}
