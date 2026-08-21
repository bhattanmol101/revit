import type { Tables, TablesUpdate } from "@/lib/supabase/database.types";
import { supabase } from "@/lib/supabase/client";

import { normalizeApiError } from "./errors";
import { runApiRequest } from "./request";

export type Profile = Tables<"profiles">;

export type UpdateProfileInput = Pick<
  TablesUpdate<"profiles">,
  "display_name" | "username"
>;

export function getProfile(userId: string): Promise<Profile | null> {
  return runApiRequest(
    async (signal) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, display_name, bio, avatar_url, created_at, updated_at")
        .eq("id", userId)
        .abortSignal(signal)
        .maybeSingle();

      if (error) {
        throw normalizeApiError(error, "We could not load your profile.");
      }

      return data;
    },
    { retries: 1 },
  );
}

export function updateProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<Profile> {
  return runApiRequest(async (signal) => {
    const { data, error } = await supabase
      .from("profiles")
      .update(input)
      .eq("id", userId)
      .select("id, username, display_name, bio, avatar_url, created_at, updated_at")
      .abortSignal(signal)
      .single();

    if (error) {
      throw normalizeApiError(error, "We could not update your profile.");
    }

    return data;
  });
}
