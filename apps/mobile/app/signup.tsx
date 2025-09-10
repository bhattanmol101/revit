import Signup from '@revit/shared/components/signup'
import { YStack } from '@revit/ui'

export default function Screen() {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center">
      <Signup />
    </YStack>
  )
}
