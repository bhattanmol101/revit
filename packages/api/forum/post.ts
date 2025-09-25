import { ForumPostT } from '@revit/shared/types/forum';
import { errorHandler } from '../utils'
import { fetchForumPosts } from '@revit/supabase/lib'

export const fetchForumPostsApi = async (
  forumId: string
): Promise<{ posts?: ForumPostT[]; error?: Error }> => {
  try {
    const forumPosts = await fetchForumPosts(forumId)
    return { posts: forumPosts }
  } catch (e: unknown) {
    return { error: errorHandler(e) }
  }
}
