import { uploadImage } from '../utils'
import { useSupabase } from '@revit/supabase/client/useSupabase'

export const createPost = async (
  userId: string,
  caption: string,
  images?: File
): Promise<Error | undefined> => {
  const supabase = await useSupabase()

  //   const resp = await uploadImage(supabase, images)

  //   console.log(resp)

  const { data, error } = await supabase
    .from('posts')
    .insert([
      {
        user_id: userId,
        caption: caption,
        media_url: `${'https://polsjqhrbgmnoivxcjrj.supabase.co/storage/v1/object/public/post-bucket/image_GZbSl4YEMK.jpg'}?width=500&height=600`,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error inserting post:', error)
  } else {
    console.log('New post:', data)
  }
  return
}
