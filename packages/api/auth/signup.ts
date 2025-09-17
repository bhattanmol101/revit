import { UserSignupT } from '@revit/shared/types/user'
import { useSupabase } from '@revit/supabase/client/useSupabase'

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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Caught an Error object:', error.message)
      return error
    } else if (typeof error === 'string') {
      console.error('Caught a string error:', error)
      return new Error(error)
    } else {
      console.error('Caught an unknown error:', error)
      return new Error('Internal Server Error')
    }
  }
}
