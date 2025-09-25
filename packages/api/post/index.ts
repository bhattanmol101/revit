import { createPost, fetchUserPosts } from '@revit/supabase/lib'
import { errorHandler } from '../utils'
import { CreatePostT, PostT } from '@revit/shared/types/post'

export const createPostApi = async (post: CreatePostT): Promise<Error | undefined> => {
  try {
    await createPost(post)
  } catch (e: unknown) {
    return errorHandler(e)
  }
}

export const fetchUserPostsApi = async (
  userId: string
): Promise<{ posts?: PostT[]; error?: Error }> => {
  try {
    const posts = await fetchUserPosts(userId)
    return { posts: posts }
  } catch (e: unknown) {
    return { error: errorHandler(e) }
  }
}
