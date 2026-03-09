import Signin from '@revit/app/features/signin'
import { YStack } from '@revit/ui'
import { KeyboardAvoidingViewProvider } from '@revit/app/provider/KeyboardAvoidingViewProvider'

export default function SigninScreen() {
  return (
    <KeyboardAvoidingViewProvider>
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        paddingHorizontal={30}
        paddingTop={50}
        paddingBottom={40}
      >
        <Signin />
      </YStack>
    </KeyboardAvoidingViewProvider>
  )
}
