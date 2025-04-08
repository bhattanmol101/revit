"use server";

import { fetchUserById } from "@/data-access/user.db";
import { User } from "@/types/user";
import { createClient } from "@/utils/supabase/server";

export const fetchUserAction = async () => {
  const supabase = await createClient();

  const resp = await supabase.auth.getUser();
  
  let user: User | null = null
  
  if (!resp.error && resp.data.user) {

    user = await fetchUserById(resp.data.user.id)
  }

  return user;
};
