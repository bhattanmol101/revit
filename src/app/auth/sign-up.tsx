import { Link } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Text } from "@/components/ui/text";
import { supabase } from "@/lib/supabase/client";

const termsUrl = process.env.EXPO_PUBLIC_TERMS_URL;

export default function SignUpScreen() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (loading) return;
    setError(null);
    setMessage(null);
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }
    if (!acceptedTerms) {
      setError("Please accept the Terms and Conditions to create an account.");
      return;
    }
    setLoading(true);
    try {
      const result = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (result.error) {
        setError(result.error.message);
        return;
      }
      if (!result.data.session) {
        setMessage(
          "Check your email to confirm your account, then return here to sign in.",
        );
      }
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We couldn’t create your account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenLayout
      keyboardAware
      title="Create your account"
      description="Share your reviews and follow people whose reviews you care about."
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
            autoComplete="new-password"
            onChangeText={setPassword}
            placeholder="At least 8 characters"
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
        {message ? (
          <Text className="text-sm text-muted-foreground">{message}</Text>
        ) : null}
        <View className="flex-row items-start gap-3">
          <Checkbox
            accessibilityLabel="I agree to the Terms and Conditions"
            checked={acceptedTerms}
            onCheckedChange={setAcceptedTerms}
            disabled={loading}
            hitSlop={8}
            className="mt-0.5"
          />
          <Text className="flex-1 text-sm text-muted-foreground">
            I agree to the{" "}
            {termsUrl ? (
              <Link
                href={termsUrl as `https://${string}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Terms and Conditions
              </Link>
            ) : (
              <Text className="text-sm">Terms and Conditions</Text>
            )}
            .
          </Text>
        </View>
        <Button size="lg" disabled={loading || !acceptedTerms} onPress={submit}>
          <Text>{loading ? "Please wait…" : "Create account"}</Text>
        </Button>
        <Link href="/auth" dismissTo asChild>
          <Button disabled={loading} className="mt-1" variant="ghost">
            <Text>Already have an account? Sign in</Text>
          </Button>
        </Link>
      </View>
    </AuthScreenLayout>
  );
}
