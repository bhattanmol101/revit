import { useSupabase } from '../client/useSupabase'
import { PostT, feed } from '@revit/shared/types/post'

export const fetchPosts = async (): Promise<PostT[]> => {
  const supabase = await useSupabase()
  const { data: posts, error } = await supabase
    .from('post')
    .select(
      `
            id,
            caption,
            image:media_url,
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
