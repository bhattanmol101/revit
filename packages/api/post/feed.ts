'use server'

import { fetchPosts } from '@revit/supabase/lib/post'
import { errorHandler } from '../utils'
import { PostT } from '@revit/shared/types/post'

export const fetchUserFeed = async (): Promise<{ feed?: PostT[]; error?: Error }> => {
  try {
    const posts = await fetchPosts()
    return { feed: posts }
  } catch (e: unknown) {
    return { error: errorHandler(e) }
  }
}
