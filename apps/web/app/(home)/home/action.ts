'use server'

import { createPost } from '@revit/api/post'

export const savePostAction = async (userId: string, text: string, images?: File) => {
  try {
    const resp = await createPost(userId, text, images)
  } catch (e: unknown) {
    console.log(e)
  }
}
