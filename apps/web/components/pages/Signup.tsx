'use client'

import Signup from '@revit/app/features/signup'
import { XStack, YStack } from '@revit/ui'
import MainImage from '@revit/shared/assets/images/Main'

export default function SignupPage() {
  return (
    <XStack flex={1} justifyContent="space-around" alignItems="center" paddingHorizontal={50}>
      <YStack flex={1} flexBasis={1}>
        <MainImage height="90vh" />
      </YStack>
      <YStack flex={1} flexBasis={2} justifyContent="center" alignItems="center">
        <YStack maxWidth="60%" width="50%">
          <Signup />
        </YStack>
      </YStack>
    </XStack>
  )
}
