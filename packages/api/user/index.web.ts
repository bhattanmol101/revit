'use server'

import { errorHandler } from '../utils'
import { fetchUserProfileById, updateUser } from '@revit/supabase/lib'
import { UpdateUserT, UserProfileT, UserT } from '@revit/shared/types/user'

export const updateUserApi = async (
  user: UserT,
  updUser: UpdateUserT
): Promise<Error | undefined> => {
  try {
    await updateUser(user, updUser)
  } catch (e: unknown) {
    return errorHandler(e)
  }
}

export const fetchUserProfileByIdApi = async (
  userId: string
): Promise<{ user?: UserProfileT; error?: Error }> => {
  try {
    const user = await fetchUserProfileById(userId)
    return { user }
  } catch (e: unknown) {
    return { error: errorHandler(e) }
  }
}
