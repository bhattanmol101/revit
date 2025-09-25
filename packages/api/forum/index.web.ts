'use server'

import { createForum, fetchForumById, fetchForumsByUser } from '@revit/supabase/lib'
import { errorHandler } from '../utils'
import { CreateForumT, ForumT } from '@revit/shared/types/forum'

export const createForumApi = async (post: CreateForumT): Promise<Error | undefined> => {
  try {
    await createForum(post)
  } catch (e: unknown) {
    return errorHandler(e)
  }
}

export const fetchForumsByUserApi = async (): Promise<{ forums?: ForumT[]; error?: Error }> => {
  try {
    const forums = await fetchForumsByUser()
    return { forums }
  } catch (e: unknown) {
    return { error: errorHandler(e) }
  }
}

export const fetchForumsByIdApi = async (
  forumId: string
): Promise<{ forum?: ForumT; error?: Error }> => {
  try {
    const forum = await fetchForumById(forumId)
    return { forum }
  } catch (e: unknown) {
    return { error: errorHandler(e) }
  }
}
