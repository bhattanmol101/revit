import { useSupabase } from '@revit/supabase/client/useSupabase'
import { errorHandler } from '../utils'
import { SigninT } from '@revit/shared/types/user'

export const signInApi = async ({ email, password }: SigninT): Promise<Error | undefined> => {
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

export const signInWithGoogleApi = async (token?: string | null): Promise<Error | undefined> => {
  if (!token) return new Error('No token provided')
  const supabase = await useSupabase()
  const { error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: token,
  })
  if (error) return errorHandler(error)
}
