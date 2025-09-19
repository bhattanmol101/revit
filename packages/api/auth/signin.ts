import { UserSigninT } from '../types/user'
import { useSupabase } from '@revit/supabase/client/useSupabase'
import { errorHandler } from '../utils'

export const signIn = async ({ email, password }: UserSigninT): Promise<Error | undefined> => {
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
