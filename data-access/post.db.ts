import { desc, eq, like, sql } from "drizzle-orm";

import { db } from "@/db";
import { InsertPost, postTable } from "@/db/schema/post";
import { reviewTable } from "@/db/schema/review";
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

export async function deletePostById(postId: string) {
  await db.transaction(async (tx) => {
    await tx.delete(postTable).where(eq(postTable.id, postId));

    await tx.delete(reviewTable).where(eq(reviewTable.postId, postId));
  });

  return;
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

export async function fetchAllPosts(userId: string, limit: number = 5) {
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
    .orderBy(desc(postTable.createdAt))
    .limit(limit);

  return {
    items: rows,
  };
}

export async function fetchAllPostsByText(text: string) {
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
    .where(like(postTable.text, `%${text}%`))
    .groupBy(postTable.id, profileTable.id)
    .orderBy(desc(postTable.createdAt))
    .limit(5);

  return {
    items: rows,
  };
}
