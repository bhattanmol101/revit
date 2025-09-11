import { signIn } from '@revit/api/signin'
import Signup from '@revit/shared/components/signup'
import { YStack } from '@revit/ui'

export default function Screen() {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" paddingHorizontal="30">
      <Signup handleSignup={signIn} />
    </YStack>
  )
}
