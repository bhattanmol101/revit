'use server'

import { CreatePostT } from '../types/post'
import { errorHandler, uploadImage } from '../utils'
import { useSupabase } from '@revit/supabase/client/useSupabase'

export const createPost = async (post: CreatePostT): Promise<Error | undefined> => {
  try {
    const supabase = await useSupabase()

    const resp = await uploadImage(supabase, post.image)
    if (resp.error) {
      return new Error('error uploading image')
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Error('invalid user')
    }

    const { error } = await supabase.from('post').insert({
      user_id: user.id,
      caption: post.caption,
      media_url: `${resp.fileUrl}?width=500&height=600`,
      rating: post.rating === 0 ? null : post.rating,
    })

    if (error) {
      console.error('Error inserting post:', error)
      return error
    }
    return
  } catch (e: unknown) {
    return errorHandler(e)
  }
}
