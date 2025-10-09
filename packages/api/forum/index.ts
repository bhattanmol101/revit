import {
  createForum,
  fetchForumById,
  fetchForumsByUser,
  fetchForumsJoinedByUser,
  fetchTrendingForums,
  joinForum,
} from '@revit/supabase/lib'
import { errorHandler } from '../utils'
import { CreateForumT, ForumT, TrendingForumT } from '@revit/shared/types/forum'

export const createForumApi = async (post: CreateForumT): Promise<Error | undefined> => {
  try {
    await createForum(post)
  } catch (e: unknown) {
    return errorHandler(e)
  }
}

export const fetchForumsByUserApi = async (): Promise<{ forums: ForumT[]; error?: Error }> => {
  try {
    const forums = await fetchForumsByUser()
    return { forums }
  } catch (e: unknown) {
    return { forums: [], error: errorHandler(e) }
  }
}

export const fetchForumsJoinedByUserApi = async (): Promise<{
  forums: ForumT[]
  error?: Error
}> => {
  try {
    const forums = await fetchForumsJoinedByUser()
    return { forums }
  } catch (e: unknown) {
    return { forums: [], error: errorHandler(e) }
  }
}

export const fetchForumByIdApi = async (
  forumId: string
): Promise<{ forum?: ForumT; error?: Error }> => {
  try {
    const forum = await fetchForumById(forumId)
    return { forum }
  } catch (e: unknown) {
    return { error: errorHandler(e) }
  }
}

export const joinForumsApi = async (forumId: string): Promise<Error | undefined> => {
  try {
    await joinForum(forumId)
  } catch (e: unknown) {
    return errorHandler(e)
  }
}

export const fetchTrendingForumsApi = async (): Promise<{
  forums?: TrendingForumT[]
  error?: Error
}> => {
  try {
    const forums = await fetchTrendingForums()
    return { forums }
  } catch (e: unknown) {
    return { error: errorHandler(e) }
  }
}
