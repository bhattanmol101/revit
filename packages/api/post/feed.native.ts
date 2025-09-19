import { PostT } from '@revit/supabase/types/post'
import { errorHandler } from '../utils'
import { fetchPosts } from '@revit/supabase/lib/post'

export const fetchUserFeed = async (): Promise<{ feed?: PostT[]; error?: Error }> => {
  try {
    const posts = await fetchPosts()
    return { feed: posts }
  } catch (e: unknown) {
    return { error: errorHandler(e) }
  }
}
