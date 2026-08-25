import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Uniwind } from "uniwind";
import "../global.css";

import { PortalHost } from "@rn-primitives/portal";
import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { ProfileMessageScreen } from "@/features/profile/profile-state-screen";
import { AppProvider } from "@/providers/app-provider";
import {
  AuthProvider,
  needsProfileCompletion,
  useAuth,
} from "@/providers/auth-provider";

SplashScreen.preventAutoHideAsync();
Uniwind.setTheme("system");

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      border: colors.border,
      card: colors.backgroundElement,
      notification: colors.primary,
      primary: colors.primary,
      text: colors.text,
    },
  };

  return (
    <>
      <SafeAreaProvider>
        <AppProvider>
          <AuthProvider>
            <ThemeProvider value={navigationTheme}>
              <RootNavigator />
            </ThemeProvider>
          </AuthProvider>
        </AppProvider>
      </SafeAreaProvider>

      <StatusBar style={isDark ? "light" : "dark"} />
      <PortalHost />
    </>
  );
}

function RootNavigator() {
  const { isLoading, profile, profileError, retryProfile, session } = useAuth();
  const needsOnboarding = needsProfileCompletion(profile);
  const canEnterApp = Boolean(session) && !needsOnboarding;

  useEffect(() => {
    if (!isLoading) {
      void SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (session && profileError) {
    return (
      <ProfileMessageScreen
        title="Profile unavailable"
        description="We couldn&apos;t load your account profile. Check your connection and try again."
        action={() => void retryProfile()}
      />
    );
  }

  return (
    <Stack>
      <Stack.Protected guard={canEnterApp}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="activity" options={{ title: "Activity" }} />
        <Stack.Screen name="create/ask" options={{ title: "New Ask" }} />
        <Stack.Screen
          name="create/share"
          options={{ title: "Rate a restaurant" }}
        />
        <Stack.Screen name="posts/[id]" options={{ title: "Post" }} />
        <Stack.Screen
          name="restaurants/[id]"
          options={{ title: "Restaurant" }}
        />
        <Stack.Screen
          name="restaurants/search"
          options={{ title: "Find a restaurant" }}
        />
        <Stack.Screen name="forums/[id]" options={{ title: "Forum" }} />
        <Stack.Screen name="picks/[id]" options={{ title: "Pick" }} />
        <Stack.Screen
          name="users/[username]/index"
          options={{ title: "Profile" }}
        />
        <Stack.Screen
          name="users/[username]/followers"
          options={{ title: "Followers" }}
        />
        <Stack.Screen
          name="users/[username]/following"
          options={{ title: "Following" }}
        />
      </Stack.Protected>

      <Stack.Protected guard={!session || needsOnboarding}>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

function AuthLoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-2 bg-background px-6">
      <Text variant="large">Loading your session…</Text>
      <Text variant="muted">
        One moment while we securely restore your account.
      </Text>
    </View>
  );
}
