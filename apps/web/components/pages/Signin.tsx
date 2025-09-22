'use client'

import Signin from '@revit/app/features/signin'
import { UserSigninT } from '@revit/shared/types/user'
import { signInAction } from '@/app/action'
import { XStack, YStack } from '@revit/ui'
import MainImage from '@revit/shared/assets/images/Main'
import { useSession } from '../Provider/ContextProvider'
import { fetchLoggedInUser } from '@revit/api/auth/user'

export default function SigninPage() {
  const { setUser } = useSession()

  const siginInHandler = async (userSignin: UserSigninT): Promise<Error | undefined> => {
    const signInError = await signInAction(userSignin)
    if (signInError) {
      return signInError
    }

    const { user, error } = await fetchLoggedInUser()
    if (error) {
      return error
    }
    if (user) {
      setUser(user)
    } else {
      return new Error('user not found!')
    }
  }
  return (
    <XStack flex={1} justifyContent="space-around" alignItems="center" paddingHorizontal={50}>
      <YStack flex={1} flexBasis={1}>
        <MainImage height="90vh" />
      </YStack>
      <YStack flex={1} flexBasis={2} justifyContent="center" alignItems="center">
        <YStack maxWidth="60%" width="50%">
          <Signin handleSignin={siginInHandler} />
        </YStack>
      </YStack>
    </XStack>
  )
}
