import { count, desc, eq, sql, sum } from "drizzle-orm";

import { db } from "@/db";
import { InsertPost, postTable } from "@/db/schema/post";
import { InsertReview, reviewTable } from "@/db/schema/review";
import { profileTable } from "@/db/schema/user";

export async function insertPost(post: InsertPost) {
  const res = await db
    .insert(postTable)
    .values(post)
    .returning({ postId: postTable.id });

  return res[0].postId;
}

export async function fetchPostById(postId: string) {
  const rows = await db
    .select({
      id: postTable.id,
      userId: postTable.userId,
      userName: profileTable.name,
      userProfileImage: profileTable.profileImage,
      text: postTable.text,
      fileList: postTable.files,
      rating: sql<number>`sum(${reviewTable.rating})`,
      totalReviews: sql<number>`count(${reviewTable.id})`,
      hashtags: postTable.hashtags,
      createdAt: postTable.createdAt,
    })
    .from(postTable)
    .leftJoin(reviewTable, eq(postTable.id, reviewTable.postId))
    .innerJoin(profileTable, eq(postTable.userId, profileTable.id))
    .where(eq(postTable.id, postId));

  return rows[0];
}

export async function fetchAllPostByUserId(userId: string) {
  const rows = await db
    .select({
      id: postTable.id,
      userId: postTable.userId,
      userName: profileTable.name,
      userProfileImage: profileTable.profileImage,
      text: postTable.text,
      fileList: postTable.files,
      rating: sql<number>`sum(${reviewTable.rating})`,
      totalReviews: sql<number>`count(${reviewTable.id})`,
      hashtags: postTable.hashtags,
      createdAt: postTable.createdAt,
    })
    .from(postTable)
    .leftJoin(reviewTable, eq(postTable.id, reviewTable.postId))
    .innerJoin(profileTable, eq(postTable.userId, profileTable.id))
    .where(eq(postTable.userId, userId))
    .groupBy(postTable.id, profileTable.id)
    .orderBy(desc(postTable.createdAt));

  return rows;
}

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

// export async function updatePost(postId: string, review: Review[]) {
//   const res = await db
//     .update(postTable)
//     .set({ reviews: review })
//     .where(eq(postTable.id, postId))
//     .returning({ postId: postTable.id });

//   return res[0].postId;
// }

export async function fetchAllPosts(userId: string) {
  const rows = await db
    .select({
      id: postTable.id,
      userId: profileTable.id,
      userName: profileTable.name,
      userProfileImage: profileTable.profileImage,
      text: postTable.text,
      fileList: postTable.files,
      rating: sql<number>`sum(${reviewTable.rating})`,
      totalReviews: sql<number>`count(${reviewTable.id})`,
      hashtags: postTable.hashtags,
      createdAt: postTable.createdAt,
    })
    .from(postTable)
    .innerJoin(profileTable, eq(postTable.userId, profileTable.id))
    .leftJoin(reviewTable, eq(reviewTable.postId, postTable.id))
    .groupBy(postTable.id, profileTable.id)
    .orderBy(desc(postTable.createdAt));

  return {
    items: rows,
  };
}
