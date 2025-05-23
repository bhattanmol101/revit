"use server";

import {
  deletePost,
  getAllPost,
  getAllPostByText,
  getTopPost,
  savePost,
} from "@/api/post.api";
import { addReviewToPost, getPostReviewsById } from "@/api/review.api";
import { PostRequest, ReviewReqest } from "@/types/post";
import { POST_LIMIT } from "@/utils/constants";
import { createClient } from "@/utils/supabase/server";
import { uploadFile } from "@/utils/utils";

export const savePostAction = async (
  userId: string,
  text: string,
  files: Blob[]
) => {
  const supabase = await createClient();

  const fileList: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const resp = await uploadFile(supabase, files[i]);

    if (resp.success) {
      fileList.push(resp.fileUrl);
    } else {
      return {
        success: false,
        error: {
          code: 103,
          message: resp.error,
        },
      };
    }
  }

  const postRequest: PostRequest = {
    userId: userId,
    text: text,
    fileList: fileList,
  };

  const resp = await savePost(postRequest);

  return {
    success: resp.success,
    error: {
      code: 102,
      message: resp.error,
    },
  };
};

export const getPostsAction = async (userId: string, page: number) => {
  let offset = page * POST_LIMIT;
  const resp = await getAllPost(userId, offset, POST_LIMIT);

  if (!resp.success) {
    throw resp.error;
  }

  return resp.posts;
};

export const addReviewToPostAction = async (
  postId: string,
  review: ReviewReqest
) => {
  const resp = await addReviewToPost(postId, review);

  return {
    success: resp.success,
    error: {
      code: 102,
      message: resp.error,
    },
  };
};

export const getPostReviewsByIdAction = async (postId: string) => {
  const resp = await getPostReviewsById(postId, "");

  return {
    success: resp.success,
    error: {
      code: 102,
      message: resp.error,
    },
    reviews: resp.reviews,
  };
};

export const deletePostAction = async (postId: string) => {
  const resp = await deletePost(postId);

  return {
    success: resp.success,
    error: {
      code: 102,
      message: resp.error,
    },
  };
};

export const getAllPostByTextAction = async (text: string) => {
  const resp = await getAllPostByText(text);

  return {
    success: resp.success,
    error: {
      code: 102,
      message: resp.error,
    },
    posts: resp.posts,
  };
};

export const getTopPostsAction = async (userId: string) => {
  const resp = await getTopPost(userId);

  if (!resp.success) {
    throw resp.error;
  }

  return resp.post;
};
