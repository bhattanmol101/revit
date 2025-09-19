import { UserSignupT } from '../types/user'
import { useSupabase } from '@revit/supabase/client/useSupabase'
import { errorHandler } from '../utils'

export const signUp = async ({
  name,
  email,
  password,
}: UserSignupT): Promise<Error | undefined> => {
  try {
    const supabase = await useSupabase()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // emailRedirectTo: process.env.EXPO_PUBLIC_AUTH_EMAIL_REDIRECT,
        data: {
          full_name: name,
        },
      },
    })

    if (error) {
      return error
    }
  } catch (e: unknown) {
    return errorHandler(e)
  }
}
