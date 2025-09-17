import { useSupabase } from '@revit/supabase/client/useSupabase'

export const fetchUserFeed = async (): Promise<{ feed?: any; error?: Error }> => {
  const supabase = await useSupabase()
  const { data: posts, error } = await supabase
    .from('posts')
    .select(
      `
    id,
    caption,
    media_url,
    created_at,
    comment:post_comments_summary(avg_rating, total_ratings, comments_count),
  `
    )
    .order('created_at', { ascending: false })

  if (error) console.error(error)

  return { feed: posts }
}
