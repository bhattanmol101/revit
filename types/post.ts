export interface Review {
  id: string;
  userId: string;
  userName: string;
  userProfileImage: string | null;
  text: string | null;
  rating: number;
  createdAt?: Date;
}

export interface ReviewReqest {
  userId: string;
  text: string | null;
  rating: number;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userProfileImage: string | null;
  text: string | null;
  fileList: string[];
  rating: number;
  totalReviews: number;
  reviews?: Review[];
  hashtags: string[];
  createdAt: Date;
}

export interface FeedPost {
  id: string;
  userId: string;
  text: string | null;
  fileList: string[];
  rating: number;
  totalReviews: number;
  hashtags: string[];
  createdAt: Date;
}

export interface PostState {
  text?: string;
  fileList: Blob[];
}

export interface PostRequest {
  userId: string;
  text?: string;
  fileList?: string[];
  hashtags?: string[];
}
