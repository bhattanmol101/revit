import {
  fetchAllPostByUserId,
  fetchAllPosts,
  fetchAllReviewsByUserId,
  fetchPostReviewsById,
  insertPost,
  insertReviewForPost,
} from "../data-access/post.db";

import { PostRequest, ReviewReqest } from "@/types/post";
import { InsertPost } from "@/db/schema/post";
import { InsertReview } from "@/db/schema/review";

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

export async function getAllUserReviews(userId: string) {
  try {
    const resp = await fetchAllReviewsByUserId(userId);

    return { success: true, reviews: resp };
  } catch (e: any) {
    return {
      success: false,
      error: e.message,
      reviews: [],
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

export async function addReviewToPost(postId: string, review: ReviewReqest) {
  const insertReview: InsertReview = {
    postId: postId,
    userId: review.userId,
    rating: review.rating,
    text: review.text,
  };

  try {
    await insertReviewForPost(insertReview);

    return { success: true };
  } catch (e: any) {
    return {
      success: false,
      error: e.message,
    };
  }
}

export async function getPostReviewsById(postId: string, userId: string) {
  try {
    const resp = await fetchPostReviewsById(postId);

    return { success: true, reviews: resp };
  } catch (e: any) {
    return {
      success: false,
      error: e.message,
    };
  }
}
