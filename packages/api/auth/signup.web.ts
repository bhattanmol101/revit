'use server'

import { useSupabase } from '@revit/supabase/client/useSupabase'
import { errorHandler } from '../utils'
import { SignupT } from '@revit/shared/types/user'

export const signUpApi = async ({ name, email, password }: SignupT): Promise<Error | undefined> => {
  try {
    const supabase = await useSupabase()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
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
