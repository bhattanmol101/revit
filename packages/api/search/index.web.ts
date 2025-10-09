'use server'

import { errorHandler } from '../utils'
import { searchForums, searchPosts } from '@revit/supabase/lib'
import { PostT } from '@revit/shared/types/post'
import { ForumT } from '@revit/shared/types/forum'

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

export const searchForumsApi = async (
  searchTest: string
): Promise<{ forums?: ForumT[]; error?: Error }> => {
  try {
    const forums = await searchForums(searchTest)
    return { forums }
  } catch (e: unknown) {
    return { error: errorHandler(e) }
  }
}
