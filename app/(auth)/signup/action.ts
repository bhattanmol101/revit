"use server";

import { sql } from "drizzle-orm";

import { createClient } from "@/utils/supabase/server";
import { db } from "@/db";
import { insertUserProfile } from "@/data-access/user.db";
import { User } from "@/types/user";

export const signUpAction = async (email: string, password: string) => {
  const user = await db.execute(
    sql`select au.id from auth.users au where au.email = ${email}`
  );

  if (user.length > 0) {
    return {
      success: false,
      error: {
        code: 100,
        message: "An account is already associated with this email.",
      },
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: {
        code: 123,
        message: error.message,
      },
    };
  } else {
    if (data.user) {
      const user: User = {
        id: data.user.id,
        email: data.user.user_metadata.email,
        name: data.user.user_metadata.email.split("@")[0],
        createdAt: new Date(data.user.created_at),
        profileImage: "",
        bio: "",
        dob: "",
      };

      await insertUserProfile(user);

      return {
        success: true,
        error: null,
      };
    }

    return {
      success: false,
      error: {
        code: 123,
        message: "could not insert profile",
      },
    };
  }
};
