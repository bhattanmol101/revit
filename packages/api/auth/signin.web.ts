'use server'

import { useSupabase } from '@revit/supabase/client/useSupabase'
import { errorHandler } from '../utils'
import { SigninT } from '@revit/shared/types/user'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

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
  token?: string | null
): Promise<{ data?: any; error?: Error | undefined }> => {
  const origin = (await headers()).get('origin')
  let url = ''
  try {
    const supabase = await useSupabase()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/api/auth/callback`,
      },
    })
    if (error) {
      return { error }
    }
    if (data) {
      url = data.url
    }
    return { error: new Error('Something went wrong! Please try again.') }
  } catch (e: unknown) {
    console.log(e)
    return { error: errorHandler(e) }
  } finally {
    // Need to do this outside try as redirect throws an error which next needs to catch
    if (url.length > 0) {
      redirect(url)
    }
  }
}
