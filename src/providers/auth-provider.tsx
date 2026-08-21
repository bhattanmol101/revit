import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Profile, UpdateProfileInput } from "@/api/profiles";
import { supabase } from "@/lib/supabase/client";
import { useProfile, useUpdateProfile } from "@/queries/profiles";

type AuthContextValue = {
  isLoading: boolean;
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
  const userId = session?.user.id ?? "";
  const profileQuery = useProfile(userId);
  const profileMutation = useUpdateProfile(userId);

  useEffect(() => {
    let isMounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;

      setSession(nextSession);
      setIsSessionLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
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

  const profile = profileQuery.data ?? null;
  const profileError =
    profileQuery.error instanceof Error ? profileQuery.error : null;
  const isLoading =
    isSessionLoading || (Boolean(session) && profileQuery.isLoading);

  const value = useMemo(
    () => ({
      isLoading,
      profile,
      profileError,
      retryProfile,
      session,
      updateProfile,
      user: session?.user ?? null,
    }),
    [isLoading, profile, profileError, retryProfile, session, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return value;
}
