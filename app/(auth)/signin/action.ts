"use server";

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
