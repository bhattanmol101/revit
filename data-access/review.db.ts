import { desc, eq } from "drizzle-orm";

import {
  businessReviewTable,
  InsertBusinessReview,
  InsertReview,
  reviewTable,
} from "@/db/schema/review";
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
    .where(eq(reviewTable.postId, postId))
    .orderBy(desc(reviewTable.createdAt));

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

export async function insertReviewForBusiness(
  businessReview: InsertBusinessReview
) {
  const res = await db
    .insert(businessReviewTable)
    .values(businessReview)
    .returning({ reviewId: businessReviewTable.id });

  return res[0].reviewId;
}

export async function fetchBusinessReviewsById(businessId: string) {
  const rows = await db
    .select({
      id: businessReviewTable.id,
      businessIdId: businessReviewTable.businessId,
      userId: businessReviewTable.id,
      userName: businessReviewTable.userName,
      // userProfileImage: businessReviewTable.profileImage,
      text: businessReviewTable.text,
      rating: businessReviewTable.rating,
      json: businessReviewTable.json,
      createdAt: businessReviewTable.createdAt,
    })
    .from(businessReviewTable)
    .leftJoin(profileTable, eq(businessReviewTable.userId, profileTable.id))
    .where(eq(businessReviewTable.businessId, businessId))
    .orderBy(desc(businessReviewTable.createdAt));

  return rows;
}
