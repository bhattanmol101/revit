import Signin from '@revit/app/features/signin'
import { YStack } from '@revit/ui'

export default function Screen() {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" paddingHorizontal="30">
      <Signin />
    </YStack>
  )
}
