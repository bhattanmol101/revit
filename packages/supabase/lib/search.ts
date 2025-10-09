import { feed, PostT } from '@revit/shared/types/post'
import { useSupabase } from '../client/useSupabase'
import { forumsSchema, ForumT } from '@revit/shared/types/forum'

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

export const searchForums = async (searchText: string): Promise<ForumT[]> => {
  const supabase = await useSupabase()
  const { data: forums, error } = await supabase
    .from('forum')
    .select(
      `
        id,
        name,
        description,
        category,
        image:media_url,
        createdAt:created_at,
        creator:profile!forum_created_by_fkey(id, name:full_name, avatar:avatar_url),
        members:forum_membership_summary(memberCount:member_count),
        posts:forum_post_summary(postCount:post_count)
    `
    )
    .or(`name.ilike.%${searchText}%,description.ilike.%${searchText}%`)
    .limit(5)
    .order('created_at', { ascending: false })

  if (error) throw error

  if (!forums) {
    return []
  }

  return forumsSchema.parse(forums)
}
