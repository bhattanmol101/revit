'use client'

import Signin from '@revit/app/components/signin'
import { UserSigninT } from '@revit/shared/types/user'
import { signInAction } from '@/app/action'
import { XStack, YStack } from '@revit/ui'
import MainImage from '@revit/app/assets/images/Main'

export default function SigninPage() {
  const siginInHandler = async (userSignin: UserSigninT) => {
    await signInAction(userSignin)
  }
  return (
    <XStack flex={1} justify="space-around" items="center" paddingHorizontal={50}>
      <YStack flex={1} flexBasis={1}>
        <MainImage height="90vh" />
      </YStack>
      <YStack flex={1} flexBasis={2} justify="center" items="center">
        <YStack maxWidth="60%" width="50%">
          <Signin handleSignin={siginInHandler} />
        </YStack>
      </YStack>
    </XStack>
  )
}
