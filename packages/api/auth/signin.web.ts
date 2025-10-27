'use server'

import { useSupabase } from '@revit/supabase/client/useSupabase'
import { errorHandler } from '../utils'
import { SigninT } from '@revit/shared/types/user'
import { redirect } from 'next/navigation'

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
  let url = ''
  try {
    const supabase = await useSupabase()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/api/auth/callback',
      },
    })
    if (error) {
      return { error }
    }
    if (data) {
      url = data.url
    }
  } catch (e: unknown) {
    console.log(e)
    return { error: errorHandler(e) }
  }

  redirect(url)
}
