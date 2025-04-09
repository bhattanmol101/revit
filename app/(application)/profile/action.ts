"use server";

import { UpdateUser } from "@/types/user";
import { createClient } from "@/utils/supabase/server";
import { uploadFile } from "@/utils/utils";
import { updateUser } from "@/api/user.api";
import { getAllUserPost, getAllUserReviews } from "@/api/post.api";

export const updateUserAction = async (
  userId: string,
  user: UpdateUser,
  file: Blob | undefined
) => {
  const supabase = await createClient();

  if (file) {
    const resp = await uploadFile(supabase, file);

    if (resp.success) {
      user.profileImage = resp.fileUrl;
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

  const resp = await updateUser(userId, user);

  return {
    success: resp.success,
    error: {
      code: 102,
      message: resp.error,
    },
  };
};

export const getAllUserPostAction = async (userId: string) => {
  const resp = await getAllUserPost(userId);

  if (resp.success) {
    return { success: true, posts: resp.posts };
  } else {
    return {
      success: false,
      error: {
        code: 102,
        message: resp.error,
      },
    };
  }
};

export const getAllUserReviewsAction = async (userId: string) => {
  const resp = await getAllUserReviews(userId);

  if (resp.success) {
    return { success: true, reviews: resp.reviews };
  } else {
    return {
      success: false,
      error: {
        code: 102,
        message: resp.error,
      },
    };
  }
};

export const logoutUserAction = async () => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      success: false,
      error: {
        code: 102,
        message: error.message,
      },
    };
  } else {
    return {
      success: true,
    };
  }
};
