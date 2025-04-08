import { UpdateUser, } from "@/types/user";

import { createClient } from "@/utils/supabase/server";

export async function updateUser(userRequest: UpdateUser) {
    try {
      const supabase = await createClient();

        const resp = await supabase.auth.updateUser({
            data: userRequest
        });
  
      return { success: true, error: "" };
    } catch (e: any) {
      return {
        success: false,
        error: e.message,
      };
    }
  }