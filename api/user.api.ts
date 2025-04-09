import { updateUserProfile } from "@/data-access/user.db";
import { UpdateUser } from "@/types/user";

export async function updateUser(userId: string, userRequest: UpdateUser) {
  try {
    await updateUserProfile(userId, userRequest);

    return { success: true, error: "" };
  } catch (e: any) {
    return {
      success: false,
      error: e.message,
    };
  }
}
