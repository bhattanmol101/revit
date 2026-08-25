import { type Href, Link } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { supabase } from "@/lib/supabase/client";

export default function AuthScreen() {
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);
    setMessage(null);
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }
    setLoading(true);
    const result =
      mode === "signIn"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    if (mode === "signUp" && !result.data.session)
      setMessage(
        "Check your email to confirm your account, then return here to sign in.",
      );
  };

  return (
    <AuthScreenLayout
      title={mode === "signIn" ? "Welcome back" : "Create your account"}
      description={
        mode === "signIn"
          ? "Sign in to see the ratings shared by people you follow."
          : "Start sharing the restaurants and recommendations you care about."
      }
    >
      <View className="gap-4">
        <View className="gap-2">
          <Text variant="small">Email</Text>
          <Input
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
        <View className="gap-2">
          <Text variant="small">Password</Text>
          <Input
            autoComplete={
              mode === "signIn" ? "current-password" : "new-password"
            }
            onChangeText={setPassword}
            placeholder="At least 8 characters"
            secureTextEntry
            value={password}
          />
        </View>
        {error ? (
          <Text className="text-sm text-destructive">{error}</Text>
        ) : null}
        {message ? (
          <Text className="text-sm text-muted-foreground">{message}</Text>
        ) : null}
        <Button disabled={loading} onPress={submit}>
          <Text>
            {loading
              ? "Please wait…"
              : mode === "signIn"
                ? "Sign in"
                : "Create account"}
          </Text>
        </Button>
        {mode === "signIn" ? (
          <Link href={"/auth/reset" as Href} asChild>
            <Button variant="link">
              <Text>Forgot password?</Text>
            </Button>
          </Link>
        ) : null}
        <Button
          disabled={loading}
          onPress={() => {
            setMode(mode === "signIn" ? "signUp" : "signIn");
            setError(null);
            setMessage(null);
          }}
          variant="ghost"
        >
          <Text>
            {mode === "signIn"
              ? "Need an account? Create one"
              : "Already have an account? Sign in"}
          </Text>
        </Button>
      </View>
    </AuthScreenLayout>
  );
}
