import { create } from "zustand";

import { BusinessReview } from "@/types/review";

export type BusinessReviewState = {
  loading: boolean;
  success: boolean;
  error: string;
  data: BusinessReview[];
};

// State types
interface States {
  reviews: BusinessReviewState;
}

// Action types
interface Actions {
  setBusinessReviews: (reviewsState: BusinessReviewState) => void;
}

// useBusinessReview
export const useBusinessReviewStore = create<States & Actions>((set) => ({
  // States
  reviews: {
    loading: true,
    success: false,
    error: "",
    data: [],
  },

  // Actions
  setBusinessReviews: (reviewsState: BusinessReviewState) =>
    set(() => ({ reviews: reviewsState })),
}));
