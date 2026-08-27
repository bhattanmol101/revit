import type { Session, User } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { Profile, UpdateProfileInput } from "@/api/profiles";
import { supabase } from "@/lib/supabase/client";
import { useProfile, useUpdateProfile } from "@/queries/profiles";

type AuthContextValue = {
  clearPasswordRecovery: () => void;
  isLoading: boolean;
  isPasswordRecovery: boolean;
  profile: Profile | null;
  profileError: Error | null;
  retryProfile: () => Promise<void>;
  session: Session | null;
  updateProfile: (input: UpdateProfileInput) => Promise<void>;
  user: User | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function needsProfileCompletion(profile: Profile | null) {
  return (
    !profile ||
    (profile.display_name === "John Doe" &&
      /^[a-f0-9]{12}$/.test(profile.username))
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const handledUrls = useRef(new Set<string>());
  const userId = session?.user.id ?? "";
  const profileQuery = useProfile(userId);
  const profileMutation = useUpdateProfile(userId);

  useEffect(() => {
    let isMounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!isMounted) return;

      setSession(nextSession);
      setIsSessionLoading(false);
      if (event === "PASSWORD_RECOVERY") setIsPasswordRecovery(true);
      if (event === "SIGNED_OUT") setIsPasswordRecovery(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const handleUrl = async (url: string) => {
      if (handledUrls.current.has(url)) return;
      handledUrls.current.add(url);

      const result = await createRecoverySession(url);

      if (isMounted && result === "recovery") {
        setIsPasswordRecovery(true);
      }
    };

    void Linking.getInitialURL().then((url) => {
      if (url) void handleUrl(url);
    });

    const subscription = Linking.addEventListener("url", ({ url }) => {
      void handleUrl(url);
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

  const retryProfile = useCallback(async () => {
    await profileQuery.refetch();
  }, [profileQuery.refetch]);

  const updateProfile = useCallback(
    async (input: UpdateProfileInput) => {
      await profileMutation.mutateAsync(input);
    },
    [profileMutation.mutateAsync],
  );

  const clearPasswordRecovery = useCallback(() => {
    setIsPasswordRecovery(false);
  }, []);

  const profile = profileQuery.data ?? null;
  const profileError =
    profileQuery.error instanceof Error ? profileQuery.error : null;
  const isLoading =
    isSessionLoading || (Boolean(session) && profileQuery.isLoading);

  const value = useMemo(
    () => ({
      clearPasswordRecovery,
      isLoading,
      isPasswordRecovery,
      profile,
      profileError,
      retryProfile,
      session,
      updateProfile,
      user: session?.user ?? null,
    }),
    [
      clearPasswordRecovery,
      isLoading,
      isPasswordRecovery,
      profile,
      profileError,
      retryProfile,
      session,
      updateProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

async function createRecoverySession(url: string): Promise<"recovery" | null> {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const hashParams = new URLSearchParams(parsed.hash.replace(/^#/, ""));
  const code = parsed.searchParams.get("code");
  const accessToken = hashParams.get("access_token");
  const refreshToken = hashParams.get("refresh_token");
  const isRecovery =
    url.includes("auth/update-password") &&
    (parsed.searchParams.get("type") === "recovery" ||
      hashParams.get("type") === "recovery" ||
      Boolean(code) ||
      Boolean(accessToken));

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    return !error && isRecovery ? "recovery" : null;
  }

  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    return !error && isRecovery ? "recovery" : null;
  }

  return null;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return value;
}
