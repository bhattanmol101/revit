'use server'

import { fetchCurrentUser } from '@revit/supabase/lib'
import { errorHandler } from '../utils'
import { UserT } from '@revit/shared/types/user'

export const fetchLoggedInUser = async (): Promise<{ user?: UserT; error?: Error }> => {
  try {
    const user = await fetchCurrentUser()
    return { user }
  } catch (e: unknown) {
    return { error: errorHandler(e) }
  }
}
