export type ForumRequest = {
  adminId: string;
  logo?: string;
  name: string;
  industry: string;
  description: string;
};

export type Forum = {
  id: string;
  userName: string;
  userProfileImage: string | null;
  adminId: string;
  logo: string | null;
  name: string;
  industry: string;
  description: string;
  createdAt: Date;
};

export interface ForumPostRequest {
  userId: string;
  forumId: string;
  text?: string;
  fileList?: string[];
  hashtags?: string[];
}

export interface ForumPostFeed {
  id: string;
  userId: string;
  forumId: string;
  userName: string | null;
  userProfileImage: string | null;
  text: string | null;
  fileList: string[];
  rating: number;
  totalReviews: number;
  hashtags: string[];
  createdAt: Date;
}
