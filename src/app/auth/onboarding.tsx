import { useState } from "react";
import { View } from "react-native";
import { ApiError } from "@/api/errors";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/providers/auth-provider";

export default function OnboardingScreen() {
  const { profile, updateProfile, user } = useAuth();
  const isPlaceholder =
    profile?.display_name === "John Doe" &&
    /^[a-f0-9]{12}$/.test(profile.username);
  const [displayName, setDisplayName] = useState(
    isPlaceholder ? "" : (profile?.display_name ?? ""),
  );
  const [username, setUsername] = useState(
    isPlaceholder ? "" : (profile?.username ?? ""),
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    const name = displayName.trim();
    if (!name) {
      setError("Enter the name people should see.");
      return;
    }
    const normalizedUsername = username.trim();
    if (!/^[a-z0-9_]{3,30}$/.test(normalizedUsername)) {
      setError("Use 3–30 lowercase letters, numbers, or underscores.");
      return;
    }
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      await updateProfile({
        display_name: name,
        username: normalizedUsername,
      });
    } catch (submissionError) {
      setError(
        submissionError instanceof ApiError && submissionError.code === "23505"
          ? "That username is already taken."
          : submissionError instanceof Error
            ? submissionError.message
            : "We could not update your profile. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthScreenLayout
      title="Make it yours"
      description="Choose the name and username people will see. You can add a bio and avatar later."
    >
      <View className="gap-4">
        <View className="gap-2">
          <Text variant="small">Display name</Text>
          <Input
            accessibilityLabel="Display name"
            onChangeText={setDisplayName}
            placeholder="Your name"
            value={displayName}
          />
        </View>
        <View className="gap-2">
          <Text variant="small">Username</Text>
          <Input
            accessibilityLabel="Username"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(value) => setUsername(value.toLowerCase())}
            placeholder="your_username"
            value={username}
          />
        </View>
        {error ? (
          <Text
            accessibilityLiveRegion="polite"
            role="alert"
            className="text-sm text-destructive"
          >
            {error}
          </Text>
        ) : null}
        <Button disabled={loading} onPress={submit}>
          <Text>{loading ? "Saving…" : "Continue"}</Text>
        </Button>
      </View>
    </AuthScreenLayout>
  );
}
