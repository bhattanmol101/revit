import { Review } from "./review";

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
