"use server";

import { sql } from "drizzle-orm";

import { createClient } from "@/utils/supabase/server";
import { db } from "@/db";
import { InsertProfile, profileTable } from "@/db/schema/user";

export const signUpAction = async (email: string, password: string) => {
  const user = await db.execute(
    sql`select au.id from auth.users au where au.email = ${email}`,
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
    if(data.user){
    // save the details in the profile table as well
    const profileUser : InsertProfile =  {
      id: data.user.id,
      email: email,
      name: email.split("@")[0],
      createdAt: new Date(data.user.created_at),
    }
  
    await db.insert(profileTable).values(profileUser)
  
    return {
      success: true,
      error: null,
    };}

    return {
      success: false,
      error: {
        code: 123,
        message: "could not insert profile",
      },
    };
  }
};
