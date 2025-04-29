"use server";

import { getBusinessReviewsById } from "@/api/review.api";
import { getQRCodeURL } from "@/utils/utils";

export const fetchQRCodeAction = async (businessId: string) => {
  const url = `https://revitapp.in/business/${businessId}/create`;
  const resp = await fetch(getQRCodeURL(url), {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });

  return resp.blob();
};

export const fetchBusinessReviewsByIdAction = async (businessId: string) => {
  const resp = await getBusinessReviewsById(businessId);

  if (!resp.success) {
    return resp.error;
  }

  return resp.reviews;
};
