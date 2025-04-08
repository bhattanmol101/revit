"use server";

import {
  addReviewToPost,
  getAllPost,
  getPostReviewsById,
  savePost,
} from "@/api/post.api";
import { PostRequest, Review, ReviewReqest } from "@/types/post";
import { createClient } from "@/utils/supabase/server";
import { uploadFile } from "@/utils/utils";

export const savePostAction = async (userId:string, text: string, files: Blob[]) => {
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

export const getAllPostAction = async (userId: string) => {
  const resp = await getAllPost(userId);

  return {
    success: resp.success,
    error: {
      code: 102,
      message: resp.error,
    },
    posts: resp.posts,
  };
};

export const addReviewToPostAction = async (
  postId: string,
  review: ReviewReqest,
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

  console.log(resp)
  return {
    success: resp.success,
    error: {
      code: 102,
      message: resp.error,
    },
    reviews: resp.reviews,
  };
};
