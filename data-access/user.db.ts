import { db } from "@/db";
import { profileTable } from "@/db/schema/user";
import { eq } from "drizzle-orm";

export async function fetchUserById(userId: string) {
    const rows = await db
      .select({
        id: profileTable.id,
        name: profileTable.name,
        email: profileTable.email,
        profileImage: profileTable.profileImage,
        dob: profileTable.dob,
        bio: profileTable.bio,
        createdAt: profileTable.createdAt,
      })
      .from(profileTable)
      .where(eq(profileTable.id, userId));
  
    return rows[0];
  }