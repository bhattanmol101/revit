'use server'

import { UserSigninT, UserSignupT } from '@revit/shared/types/user'
import { signIn } from '@revit/api/auth/signin'
import { fetchLoggedInUser } from '@revit/api/auth/user'
import { signUp } from '@revit/api/auth/signup'

export const signInAction = async (user: UserSigninT) => {
  return await signIn(user)
}

export const signUpAction = async (user: UserSignupT) => {
  return await signUp(user)
}

export const fetchLoggedInUserAction = async () => {
  return await fetchLoggedInUser()
}
