'use server'

import { UserSigninT } from '@revit/shared/types/user'
import { signIn } from '@revit/api/auth/signin'
import { fetchLoggedInUser } from '@revit/api/auth/user'

export const signInAction = async ({ email, password }: UserSigninT) => {
  return await signIn({ email, password })
}

export const fetchLoggedInUserAction = async () => {
  return await fetchLoggedInUser()
}
