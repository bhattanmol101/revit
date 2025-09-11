'use client'

import Signin from '@revit/shared/components/signin'
import { UserSigninT } from '@revit/shared/types/user'
import { signInAction } from '@/app/action'
import { useToastController, XStack, YStack } from '@revit/ui'
import MainImage from '@revit/shared/assets/images/Main'
import { useRouter } from 'next/navigation'

export default function SigninPage() {
  const router = useRouter()
  const toast = useToastController()

  const siginInHandler = async (userSignin: UserSigninT) => {
    const error = await signInAction(userSignin)
    console.log(error)
    if (error) {
      toast.show('Successfully saved!', {
        message: "Don't worry, we've got your data.",
        customData: { type: 'error' },
      })
    } else {
      router.push('/home')
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
