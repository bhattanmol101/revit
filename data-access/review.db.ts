import { desc, eq } from "drizzle-orm";

import { InsertReview, reviewTable } from "@/db/schema/review";
import { profileTable } from "@/db/schema/user";
import { db } from "@/db";

export async function fetchPostReviewsById(postId: string) {
  const rows = await db
    .select({
      id: reviewTable.id,
      userId: profileTable.id,
      userName: profileTable.name,
      userProfileImage: profileTable.profileImage,
      text: reviewTable.text,
      rating: reviewTable.rating,
      createdAt: reviewTable.createdAt,
    })
    .from(reviewTable)
    .innerJoin(profileTable, eq(reviewTable.userId, profileTable.id))
    .where(eq(reviewTable.postId, postId));

  return rows;
}

export async function fetchAllReviewsByUserId(userId: string) {
  const rows = await db
    .select({
      id: reviewTable.id,
      userId: profileTable.id,
      userName: profileTable.name,
      userProfileImage: profileTable.profileImage,
      text: reviewTable.text,
      rating: reviewTable.rating,
      createdAt: reviewTable.createdAt,
    })
    .from(reviewTable)
    .innerJoin(profileTable, eq(reviewTable.userId, profileTable.id))
    .where(eq(reviewTable.userId, userId))
    .orderBy(desc(reviewTable.createdAt));

  return rows;
}

export async function insertReviewForPost(review: InsertReview) {
  const res = await db
    .insert(reviewTable)
    .values(review)
    .returning({ reviewId: reviewTable.id });

  return res[0].reviewId;
}
