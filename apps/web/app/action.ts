'use server'

import { UserSigninT } from '@revit/shared/types/user'
import { signIn } from '@revit/api/signin'

export const signInAction = async ({ email, password }: UserSigninT) => {
  return await signIn({ email, password })
}
