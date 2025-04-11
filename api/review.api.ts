import {
  fetchAllReviewsByUserId,
  fetchPostReviewsById,
  insertReviewForPost,
} from "@/data-access/review.db";
import { InsertReview } from "@/db/schema/review";
import { ReviewReqest } from "@/types/post";

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
