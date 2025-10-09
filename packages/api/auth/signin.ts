import { useSupabase } from '@revit/supabase/client/useSupabase'
import { errorHandler } from '../utils'
import { UserSigninT } from '@revit/shared/types/user'

export const signInApi = async ({ email, password }: UserSigninT): Promise<Error | undefined> => {
  try {
    const supabase = await useSupabase()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return error
    }
  } catch (e: unknown) {
    return errorHandler(e)
  }
}
