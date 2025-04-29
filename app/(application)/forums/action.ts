"use server";

import {
  getAllForumPost,
  getAllForums,
  getForumById,
  saveForum,
  saveForumPost,
} from "@/api/forum.api";
import { ForumPostRequest, ForumRequest } from "@/types/forum";
import { POST_LIMIT } from "@/utils/constants";
import { createClient } from "@/utils/supabase/server";
import { uploadFile } from "@/utils/utils";

export const saveForumAction = async (
  forumRequest: ForumRequest,
  logo?: Blob
) => {
  if (logo) {
    const supabase = await createClient();

    const fuResp = await uploadFile(supabase, logo);

    if (!fuResp.success) {
      return {
        success: false,
        error: {
          code: 103,
          message: fuResp.error,
        },
      };
    }

    forumRequest.logo = fuResp.fileUrl;
  }

  const resp = await saveForum(forumRequest);

  return {
    success: resp.success,
    error: {
      code: 102,
      message: resp.error,
    },
    id: resp.id,
  };
};

export const fetchForumByIdAction = async (forumId: string) => {
  const resp = await getForumById(forumId);

  if (!resp.success) {
    return undefined;
  }

  return resp.forum;
};

export const saveForumPostAction = async (
  forumPostRequest: ForumPostRequest,
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

  forumPostRequest.fileList = fileList;

  const resp = await saveForumPost(forumPostRequest);

  return {
    success: resp.success,
    error: {
      code: 102,
      message: resp.error,
    },
  };
};

export const getForumPostsAction = async (userId: string, page: number) => {
  let offset = page * POST_LIMIT;
  const resp = await getAllForumPost(userId, offset, POST_LIMIT);

  if (!resp.success) {
    throw undefined;
  }

  return resp.posts;
};

export const fetchAllForumsAction = async (userId: string) => {
  const resp = await getAllForums(userId);

  console.log(resp);

  if (!resp.success) {
    return undefined;
  }

  return resp.forums;
};
