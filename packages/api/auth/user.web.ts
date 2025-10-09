'use server'

import { fetchCurrentUser } from '@revit/supabase/lib'
import { errorHandler } from '../utils'
import { UserT } from '@revit/shared/types/user'
import { useSupabase } from '@revit/supabase/client/useSupabase'

export const fetchLoggedInUser = async (): Promise<{ user?: UserT; error?: Error }> => {
  try {
    const user = await fetchCurrentUser()
    return { user }
  } catch (e: unknown) {
    return { error: errorHandler(e) }
  }
}

export const signOutApi = async () => {
  try {
    const supabase = await useSupabase()

    const { error } = await supabase.auth.signOut()

    if (error) {
      return error
    }
  } catch (e: unknown) {
    return errorHandler(e)
  }
}
