import { useSupabase } from '../client/useSupabase'
import { commentsSchema, CommentT, CreateCommentT } from '@revit/shared/types/comment'

export const createComment = async (comment: CreateCommentT): Promise<void> => {
  const supabase = await useSupabase()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('invalid user')
  }

  const { error } = await supabase.from('comment').insert({
    user_id: user.id,
    post_id: comment.postId,
    content: comment.content,
    rating: comment.rating,
  })

  if (error) {
    if (error.code === '23505') {
      throw new Error('You can give review only once!')
    }
    throw new Error('Something went wrong! Please try again.')
  }
  return
}

export const fetchCommentsByPostId = async (postId: string): Promise<CommentT[]> => {
  const supabase = await useSupabase()
  const { data: comments, error } = await supabase
    .from('comment')
    .select(
      `
        id,
        content,
        rating,
        createdAt:created_at,
        user:profile(id, name:full_name, avatar:avatar_url)
      `
    )
    .eq('post_id', postId)
    .order('created_at', { ascending: false })

  if (error) throw error

  if (!comments) {
    return []
  }

  return commentsSchema.parse(comments)
}
