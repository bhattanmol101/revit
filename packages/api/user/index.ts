import { errorHandler } from '../utils'
import { updateUser } from '@revit/supabase/lib'
import { UpdateUserT, UserT } from '@revit/shared/types/user'

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
