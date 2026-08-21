import { Stack } from "expo-router";

import { needsProfileCompletion, useAuth } from "@/providers/auth-provider";

export default function AuthLayout() {
  const { profile, session } = useAuth();
  const needsOnboarding = needsProfileCompletion(profile);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="index" />
        <Stack.Screen name="reset" />
      </Stack.Protected>

      <Stack.Protected guard={Boolean(session) && needsOnboarding}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>
    </Stack>
  );
}
