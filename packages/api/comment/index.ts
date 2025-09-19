'use server'

import { CreateCommentT } from '../types/comment'
import { errorHandler } from '../utils'
import { useSupabase } from '@revit/supabase/client/useSupabase'

export const createComment = async (comment: CreateCommentT): Promise<Error | undefined> => {
  try {
    const supabase = await useSupabase()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Error('invalid user')
    }

    const { error } = await supabase.from('comment').insert({
      user_id: user.id,
      post_id: comment.postId,
      content: comment.text,
      rating: comment.rating,
    })

    if (error) {
      if (error.code === '23505') {
        return new Error('You can give review only once!')
      }
      return new Error('Something went wrong! Please try again.')
    }
    return
  } catch (e: unknown) {
    return errorHandler(e)
  }
}
