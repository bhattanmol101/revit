import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Uniwind } from "uniwind";
import "../global.css";

import { PortalHost } from "@rn-primitives/portal";
import { Text } from "@/components/ui/text";
import {
  AuthProvider,
  needsProfileCompletion,
  useAuth,
} from "@/providers/auth-provider";

SplashScreen.preventAutoHideAsync();
Uniwind.setTheme("system");

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <SafeAreaProvider>
        <AuthProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <RootNavigator />
          </ThemeProvider>
        </AuthProvider>
      </SafeAreaProvider>

      <PortalHost />
    </>
  );
}

function RootNavigator() {
  const { isLoading, profile, session } = useAuth();
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

  return (
    <Stack>
      <Stack.Protected guard={canEnterApp}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="activity" options={{ title: "Activity" }} />
        <Stack.Screen name="posts/[id]" options={{ title: "Post" }} />
        <Stack.Screen
          name="restaurants/[id]"
          options={{ title: "Restaurant" }}
        />
        <Stack.Screen name="forums/[id]" options={{ title: "Forum" }} />
        <Stack.Screen name="picks/[id]" options={{ title: "Pick" }} />
        <Stack.Screen name="users/[username]" options={{ title: "Profile" }} />
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
