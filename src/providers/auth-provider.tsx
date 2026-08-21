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

import {
  getProfile,
  updateProfile as updateProfileRequest,
  type Profile,
  type UpdateProfileInput,
} from "@/api/profiles";
import { supabase } from "@/lib/supabase/client";

type AuthContextValue = {
  isLoading: boolean;
  profile: Profile | null;
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
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

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

  const refreshProfile = useCallback(async () => {
    if (!session?.user.id) {
      setProfile(null);
      return;
    }

    setIsProfileLoading(true);

    try {
      setProfile(await getProfile(session.user.id));
    } catch (error) {
      console.error("Failed to load the authenticated profile", error);
      setProfile(null);
    } finally {
      setIsProfileLoading(false);
    }
  }, [session?.user.id]);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  const updateProfile = useCallback(
    async (input: UpdateProfileInput) => {
      if (!session?.user.id) {
        throw new Error("You must be signed in to update your profile.");
      }

      setProfile(await updateProfileRequest(session.user.id, input));
    },
    [session?.user.id],
  );

  const value = useMemo(
    () => ({
      isLoading: isSessionLoading || isProfileLoading,
      profile,
      session,
      updateProfile,
      user: session?.user ?? null,
    }),
    [isProfileLoading, isSessionLoading, profile, session, updateProfile],
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
