export interface Review {
  id: string;
  userId: string;
  userName: string;
  userProfileImage: string | null;
  text: string | null;
  rating: number;
  createdAt?: Date;
}

export interface ReviewRequest {
  userId: string;
  text: string | null;
  rating: number;
}

export interface BusinessReview {
  id: string;
  businessId: string;
  userId?: string;
  userName?: string;
  userProfileImage?: string;
  text?: string;
  rating: number;
  json: any;
  createdAt: Date;
}

export interface BusinessReviewRequest {
  userId?: string;
  businessId: string;
  userName?: string;
  rating: number;
  text?: string;
  json?: any;
}
