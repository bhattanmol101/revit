import { Link } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Text } from "@/components/ui/text";
import { supabase } from "@/lib/supabase/client";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (loading) return;
    setError(null);
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Enter your password.");
      return;
    }
    setLoading(true);
    try {
      const result = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (result.error) {
        setError(result.error.message);
        return;
      }
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We couldn’t sign you in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenLayout
      keyboardAware
      title="Welcome back"
      description="Sign in to see the ratings shared by people you follow."
    >
      <View className="gap-5">
        <View className="gap-2">
          <Text variant="small">Email</Text>
          <Input
            accessibilityLabel="Email address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            inputMode="email"
            keyboardType="email-address"
            editable={!loading}
            onChangeText={setEmail}
            placeholder="name@example.com"
            value={email}
          />
        </View>
        <View className="gap-2">
          <Text variant="small">Password</Text>
          <PasswordInput
            accessibilityLabel="Password"
            autoComplete="current-password"
            onChangeText={setPassword}
            placeholder="Your password"
            editable={!loading}
            returnKeyType="done"
            onSubmitEditing={() => void submit()}
            value={password}
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
        <Link href="/auth/forgot-password" className="self-end">
          <Text className="text-xs text-muted-foreground">
            Forgot password?
          </Text>
        </Link>
        <Button size="lg" disabled={loading} onPress={submit}>
          <Text>{loading ? "Please wait…" : "Sign in"}</Text>
        </Button>
        <Link href="/auth/sign-up" asChild>
          <Button disabled={loading} className="mt-1" variant="ghost">
            <Text>Need an account? Create one</Text>
          </Button>
        </Link>
      </View>
    </AuthScreenLayout>
  );
}
