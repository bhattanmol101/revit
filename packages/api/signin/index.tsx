import { UserSigninT } from '@revit/shared/types/user'
import { createSupabaseClient } from '../utils/supabase'

export const signIn = async ({ email, password }: UserSigninT) => {
  try {
    const supabase = await createSupabaseClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return error.message
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Caught an Error object:', error.message)
      return error.message
    } else if (typeof error === 'string') {
      console.error('Caught a string error:', error)
      return error
    } else {
      console.error('Caught an unknown error:', error)
      return error
    }
  }
}
