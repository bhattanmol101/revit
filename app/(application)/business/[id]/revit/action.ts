"use server";

import { addReviewToBusiness } from "@/api/review.api";
import { BusinessReviewRequest } from "@/types/review";

export const saveReviewForBusinessAction = async (
  businessId: string,
  businessReviewRequest: BusinessReviewRequest
) => {
  const resp = await addReviewToBusiness(businessId, businessReviewRequest);

  return {
    success: resp.success,
    error: {
      code: 102,
      message: resp.error,
    },
  };
};
