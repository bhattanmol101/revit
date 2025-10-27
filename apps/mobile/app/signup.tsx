import Signup from '@revit/app/features/signup'
import { YStack } from '@revit/ui'
import { KeyboardAvoidingViewProvider } from '@revit/app/provider/KeyboardAvoidingViewProvider'

export default function Screen() {
  return (
    <KeyboardAvoidingViewProvider>
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        paddingHorizontal={30}
        paddingTop={50}
      >
        <Signup />
      </YStack>
    </KeyboardAvoidingViewProvider>
  )
}
