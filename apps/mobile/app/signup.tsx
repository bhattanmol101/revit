import { signUp } from '@revit/api/auth/signup'
import Signup from '@revit/shared/components/signup'
import { YStack } from '@revit/ui'

export default function Screen() {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" paddingHorizontal="30">
      <Signup handleSignup={signUp} />
    </YStack>
  )
}
