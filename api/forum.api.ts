import {
  fetchAllForums,
  fetchAllPostByForumId,
  fetchForumById,
  insertForum,
  insertForumPost,
} from "@/data-access/forum.db";
import { InsertForum } from "@/db/schema/forum";
import { InsertForumPost } from "@/db/schema/post";
import { ForumPostRequest, ForumRequest } from "@/types/forum";

export async function saveForum(forumRequest: ForumRequest) {
  try {
    const insertForumT: InsertForum = {
      adminId: forumRequest.adminId,
      name: forumRequest.name,
      description: forumRequest.description,
      logo: forumRequest.logo,
      industry: forumRequest.industry,
    };

    const id = await insertForum(insertForumT);

    return { success: true, error: "", id: id };
  } catch (e: any) {
    return {
      success: false,
      error: e.message,
      id: "",
    };
  }
}

export async function getForumById(forumId: string) {
  try {
    const resp = await fetchForumById(forumId);

    return { success: true, forum: resp };
  } catch (e: any) {
    return {
      success: false,
      error: e.message,
    };
  }
}

export async function saveForumPost(forumPostRequest: ForumPostRequest) {
  try {
    const insertForumPostT: InsertForumPost = {
      userId: forumPostRequest.userId,
      forumId: forumPostRequest.forumId,
      text: forumPostRequest.text?.trim(),
      files: forumPostRequest.fileList,
      hashtags: forumPostRequest.hashtags,
    };

    await insertForumPost(insertForumPostT);

    return { success: true, error: "" };
  } catch (e: any) {
    return {
      success: false,
      error: e.message,
    };
  }
}

export async function getAllForumPost(
  forumId: string,
  offset: number,
  limit: number
) {
  try {
    const resp = await fetchAllPostByForumId(forumId);

    return { success: true, posts: resp };
  } catch (e: any) {
    return {
      success: false,
      error: e.message,
      posts: [],
    };
  }
}

export async function getAllForums(userId: string) {
  try {
    const resp = await fetchAllForums(userId);

    return { success: true, forums: resp };
  } catch (e: any) {
    return {
      success: false,
      error: e.message,
    };
  }
}
