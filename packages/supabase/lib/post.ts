import { useSupabase } from '../client/useSupabase'
import { CreatePostT, PostT, feed } from '@revit/shared/types/post'
import { uploadImages } from '../utils'

export const createPost = async ({ caption, images, rating }: CreatePostT) => {
  const supabase = await useSupabase()

  let fileUrls: string[] = []
  if (images && images.length > 0) {
    fileUrls = await uploadImages(supabase, images)
    if (fileUrls.length == 0) {
      throw new Error('could not upload files')
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('invalid user session')
  }

  const { error } = await supabase.from('post').insert({
    user_id: user.id,
    caption: caption,
    media_url: fileUrls,
    rating: rating === 0 ? null : rating,
  })

  if (error) {
    throw new Error(`error saving post: ${error.message}`)
  }
}

export const fetchPosts = async (): Promise<PostT[]> => {
  const supabase = await useSupabase()
  const { data: posts, error } = await supabase
    .from('post')
    .select(
      `
        id,
        caption,
        images:media_url,
        rating,
        createdAt:created_at,
        user:profile(id, name:full_name, avatar:avatar_url),
        comment:post_comment_summary(avgRating:avg_rating, commentCount:comment_count)
      `
    )
    .order('created_at', { ascending: false })

  if (error) throw error

  if (!posts) {
    return []
  }

  return feed.parse(posts)
}
