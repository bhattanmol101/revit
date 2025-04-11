import {
  deletePostById,
  fetchAllPostByUserId,
  fetchAllPosts,
  insertPost,
} from "../data-access/post.db";

import { PostRequest } from "@/types/post";
import { InsertPost } from "@/db/schema/post";

export async function getAllPost(userId: string) {
  try {
    const resp = await fetchAllPosts(userId);

    return { success: true, posts: resp.items };
  } catch (e: any) {
    return {
      success: false,
      error: e.message,
      posts: [],
    };
  }
}

export async function getAllUserPost(userId: string) {
  try {
    const resp = await fetchAllPostByUserId(userId);

    return { success: true, posts: resp };
  } catch (e: any) {
    return {
      success: false,
      error: e.message,
      posts: [],
    };
  }
}

export async function savePost(postRequest: PostRequest) {
  try {
    const insertPostT: InsertPost = {
      userId: postRequest.userId,
      text: postRequest.text,
      files: postRequest.fileList,
      hashtags: postRequest.hashtags,
    };

    await insertPost(insertPostT);

    return { success: true, error: "" };
  } catch (e: any) {
    return {
      success: false,
      error: e.message,
    };
  }
}

export async function deletePost(postId: string) {
  try {
    await deletePostById(postId);

    return { success: true, error: "" };
  } catch (e: any) {
    return {
      success: false,
      error: e.message,
    };
  }
}
