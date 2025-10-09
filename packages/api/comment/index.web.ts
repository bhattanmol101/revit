'use server'

import { errorHandler } from '../utils'
import { createComment, fetchCommentsByPostId } from '@revit/supabase/lib'
import { CommentT, CreateCommentT } from '@revit/shared/types/comment'

export const createCommentApi = async (comment: CreateCommentT): Promise<Error | undefined> => {
  try {
    await createComment(comment)
  } catch (e: unknown) {
    return errorHandler(e)
  }
}

export const fetchPostCommentsApi = async (
  postId: string,
  type: string
): Promise<{ comments: CommentT[]; error?: Error }> => {
  try {
    const comments = await fetchCommentsByPostId(postId, type)
    return { comments }
  } catch (e: unknown) {
    return { comments: [], error: errorHandler(e) }
  }
}
