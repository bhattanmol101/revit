import { signIn } from '@revit/api/signin'
import Signin from '@revit/shared/components/signin'
import { YStack } from '@revit/ui'

export default function Screen() {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" paddingHorizontal="30">
      <Signin handleSignin={signIn} />
    </YStack>
  )
}
