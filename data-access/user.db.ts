import { eq } from "drizzle-orm";

import { db } from "@/db";
import { InsertProfile, profileTable } from "@/db/schema/user";
import { User } from "@/types/user";

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

export async function insertUserProfile(user: User) {
  // save the details in the profile table as well
  const profileUser: InsertProfile = {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: new Date(user.createdAt),
    profileImage: user.profileImage,
  };

  const res = await db
    .insert(profileTable)
    .values(profileUser)
    .returning({ userId: profileTable.id });

  return res[0].userId;
}
