import { CreateForumPostT, ForumPostT } from '@revit/shared/types/forum'
import { errorHandler } from '../utils'
import { createForumPost, fetchForumPosts } from '@revit/supabase/lib'

export const createForumPostApi = async (post: CreateForumPostT): Promise<Error | undefined> => {
  try {
    await createForumPost(post)
  } catch (e: unknown) {
    return errorHandler(e)
  }
}

export const fetchForumPostsApi = async (
  forumId: string
): Promise<{ posts: ForumPostT[]; error?: Error }> => {
  try {
    const forumPosts = await fetchForumPosts(forumId)
    return { posts: forumPosts }
  } catch (e: unknown) {
    return { posts: [], error: errorHandler(e) }
  }
}
