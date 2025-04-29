import {
  fetchAllReviewsByUserId,
  fetchBusinessReviewsById,
  fetchPostReviewsById,
  insertReviewForBusiness,
  insertReviewForPost,
} from "@/data-access/review.db";
import { InsertBusinessReview, InsertReview } from "@/db/schema/review";
import { BusinessReviewRequest, ReviewRequest } from "@/types/review";

export async function addReviewToPost(postId: string, review: ReviewRequest) {
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

export async function addReviewToBusiness(
  businessId: string,
  businessReview: BusinessReviewRequest
) {
  const insertReview: InsertBusinessReview = {
    businessId: businessId,
    userName: businessReview.userName,
    userId: businessReview.userId,
    rating: businessReview.rating,
    text: businessReview.text,
    json: businessReview.json,
  };

  try {
    await insertReviewForBusiness(insertReview);

    return { success: true };
  } catch (e: any) {
    return {
      success: false,
      error: e.message,
    };
  }
}

export async function getBusinessReviewsById(businessId: string) {
  try {
    const resp = await fetchBusinessReviewsById(businessId);

    return { success: true, reviews: resp };
  } catch (e: any) {
    return {
      success: false,
      error: e.message,
    };
  }
}
