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

export const signInWithGoogleApi = async (
  redirectUri?: string
): Promise<{ uri?: string; error?: Error | undefined }> => {
  try {
    console.log(redirectUri)
    const supabase = await useSupabase()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUri,
        skipBrowserRedirect: true,
      },
    })
    if (error) {
      return { error }
    }
    if (data) return { uri: data.url }
    return { error: new Error('Something went wrong! Please try again.') }
  } catch (e: unknown) {
    return { error: errorHandler(e) }
  }
}
