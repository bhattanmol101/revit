import { desc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { forumTable, InsertForum } from "@/db/schema/forum";
import { profileTable } from "@/db/schema/user";
import { forumPostTable, InsertForumPost } from "@/db/schema/post";
import { forumReviewTable } from "@/db/schema/review";

export async function insertForum(forum: InsertForum) {
  const res = await db
    .insert(forumTable)
    .values(forum)
    .returning({ forumId: forumTable.id });

  return res[0].forumId;
}

export async function fetchForumById(forumId: string) {
  const rows = await db
    .select({
      id: forumTable.id,
      userName: profileTable.name,
      userProfileImage: profileTable.profileImage,
      adminId: forumTable.adminId,
      name: forumTable.name,
      logo: forumTable.logo,
      description: forumTable.description,
      industry: forumTable.industry,
      createdAt: forumTable.createdAt,
    })
    .from(forumTable)
    .innerJoin(profileTable, eq(forumTable.adminId, profileTable.id))
    .where(eq(forumTable.id, forumId));

  return rows[0];
}

export async function insertForumPost(forumPost: InsertForumPost) {
  const res = await db
    .insert(forumPostTable)
    .values(forumPost)
    .returning({ postId: forumPostTable.id });

  return res[0].postId;
}

export async function fetchAllPostByForumId(forumId: string) {
  const rows = await db
    .select({
      id: forumPostTable.id,
      userId: forumPostTable.userId,
      forumId: forumPostTable.forumId,
      userName: profileTable.name,
      userProfileImage: profileTable.profileImage,
      text: forumPostTable.text,
      fileList: forumPostTable.files,
      rating: sql<number>`sum(${forumReviewTable.rating})`,
      totalReviews: sql<number>`count(${forumReviewTable.id})`,
      hashtags: forumPostTable.hashtags,
      createdAt: forumPostTable.createdAt,
    })
    .from(forumPostTable)
    .leftJoin(forumReviewTable, eq(forumPostTable.id, forumReviewTable.postId))
    .innerJoin(profileTable, eq(forumPostTable.userId, profileTable.id))
    .where(eq(forumPostTable.forumId, forumId))
    .groupBy(forumPostTable.id, profileTable.id)
    .orderBy(desc(forumPostTable.createdAt));

  return rows;
}

export async function fetchAllForums(userId: string) {
  const rows = await db
    .select({
      id: forumTable.id,
      userName: profileTable.name,
      userProfileImage: profileTable.profileImage,
      adminId: forumTable.adminId,
      name: forumTable.name,
      logo: forumTable.logo,
      description: forumTable.description,
      industry: forumTable.industry,
      createdAt: forumTable.createdAt,
    })
    .from(forumTable)
    .innerJoin(profileTable, eq(forumTable.adminId, profileTable.id))
    .orderBy(desc(forumTable.createdAt));

  return rows;
}
