import * as Linking from "expo-linking";
import { Link } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { supabase } from "@/lib/supabase/client";

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    setError(null);
    setMessage(null);
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const { error: requestError } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo: Linking.createURL("auth/update-password") },
      );
      if (requestError) {
        setError(requestError.message);
        return;
      }
      setMessage(
        "If that account exists, reset instructions are on their way.",
      );
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We couldn’t send reset instructions. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthScreenLayout
      title="Reset your password"
      description="Enter your email and we’ll send you instructions to regain access."
    >
      <View className="gap-4">
        <View className="gap-2">
          <Text variant="small">Email</Text>
          <Input
            accessibilityLabel="Email address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            inputMode="email"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="you@example.com"
            value={email}
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
        {message ? (
          <Text className="text-sm text-muted-foreground">{message}</Text>
        ) : null}
        <Button disabled={loading} onPress={submit}>
          <Text>{loading ? "Sending…" : "Send reset instructions"}</Text>
        </Button>
        <Link href="/auth" asChild>
          <Button variant="ghost">
            <Text>Back to sign in</Text>
          </Button>
        </Link>
      </View>
    </AuthScreenLayout>
  );
}
