'use server'

import { PostT } from '@revit/shared/types/post'
import { errorHandler } from '../utils'
import { fetchPosts } from '@revit/supabase/lib/post'

export const fetchUserFeed = async (
  from: number,
  to: number
): Promise<{ feed: PostT[]; error?: Error }> => {
  try {
    const posts = await fetchPosts(from, to)
    return { feed: posts || [] }
  } catch (e: unknown) {
    return { feed: [], error: errorHandler(e) }
  }
}
