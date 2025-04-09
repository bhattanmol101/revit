"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { SignupUser } from "@/types/user";
import { createClient } from "@/utils/supabase/server";

export const signInAction = async ({ email, password }: SignupUser) => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: {
        code: 101,
        message: error.message,
      },
    };
  }

  return {
    success: true,
    error: null,
  };
};

export const signInWithGoogleAction = async () => {
  const origin = (await headers()).get("origin");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (data.url) {
    redirect(data.url);
  }
};
