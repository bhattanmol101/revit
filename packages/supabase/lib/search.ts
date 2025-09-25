import { feed, PostT } from '@revit/shared/types/post'
import { useSupabase } from '../client/useSupabase'

export const searchPosts = async (searchText: string): Promise<PostT[]> => {
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
    .ilike('caption', `%${searchText}%`)
    .limit(5)
    .order('created_at', { ascending: false })

  if (error) throw error

  if (!posts) {
    return []
  }

  return feed.parse(posts)
}
