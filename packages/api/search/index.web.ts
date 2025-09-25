'use server'

import { errorHandler } from '../utils'
import { searchPosts } from '@revit/supabase/lib'
import { PostT } from '@revit/shared/types/post'

export const searchPostsApi = async (
  searchTest: string
): Promise<{ posts?: PostT[]; error?: Error }> => {
  try {
    const posts = await searchPosts(searchTest)
    return { posts }
  } catch (e: unknown) {
    return { error: errorHandler(e) }
  }
}
