import {
  deletePostById,
  fetchAllPostByUserId,
  fetchAllPosts,
  fetchAllPostsByText,
  fetchTopPost,
  insertPost,
} from "../data-access/post.db";

import { Post, PostRequest } from "@/types/post";
import { InsertPost } from "@/db/schema/post";
import { getRating } from "@/utils/utils";

export async function getAllPost(
  userId: string,
  offset: number,
  limit: number
) {
  try {
    const resp = await fetchAllPosts(userId, offset, limit);

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

export async function getAllPostByText(text: string) {
  try {
    const resp = await fetchAllPostsByText(text);

    return { success: true, posts: resp.items };
  } catch (e: any) {
    return {
      success: false,
      error: e.message,
      posts: [],
    };
  }
}

export async function getTopPost(userId: string) {
  try {
    const resp = await fetchTopPost(userId);

    if (resp && resp.items) {
      let maxRating = 0;
      let maxPost: Post | undefined;

      resp.items.forEach((item) => {
        let currRating = getRating(
          Number(item.rating),
          Number(item.totalReviews)
        );

        if (maxRating < currRating) {
          maxRating = currRating;
          maxPost = item;
        }
      });

      return {
        success: true,
        error: "",
        post: maxPost,
      };
    }

    return { success: true, posts: resp.items };
  } catch (e: any) {
    return {
      success: false,
      error: e.message,
    };
  }
}
