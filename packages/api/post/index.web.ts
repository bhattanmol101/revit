'use server'

import { createPost } from '@revit/supabase/lib'
import { errorHandler } from '../utils'
import { CreatePostT } from '@revit/shared/types/post'

export const createPostApi = async (post: CreatePostT): Promise<Error | undefined> => {
  try {
    await createPost(post)
  } catch (e: unknown) {
    return errorHandler(e)
  }
}
