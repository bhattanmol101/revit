import { Toast, useToastState } from '@tamagui/toast'
import { Theme, YStack } from 'tamagui'

export const NativeToast = () => {
  const currentToast = useToastState()

  let isSuccess: boolean = false
  let isDanger: boolean = false

  if (currentToast && currentToast.customData) {
    isDanger = currentToast.customData?.type === 'error'
    isSuccess = currentToast.customData?.type === 'success'
  }

  if (!currentToast || currentToast.isHandledNatively) {
    return null
  }

  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      viewportName={currentToast.viewportName}
      flexWrap="wrap"
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={50}
      borderRadius={10}
      opacity={1}
      scale={1}
      animation="quick"
      backgroundColor={isSuccess ? '$green12' : isDanger ? '$red12' : '$background'}
    >
      <YStack py="$1.5" gap="$1.5">
        <Toast.Title
          fontSize="$3"
          color={isSuccess ? '$green10' : isDanger ? '$red10' : '$background'}
        >
          {currentToast.title}
        </Toast.Title>
        {!!currentToast.message && (
          <Toast.Description
            color={isSuccess ? '$green9' : isDanger ? '$red9' : 'white'}
            fontWeight={400}
            fontSize="$2"
          >
            {currentToast.message}
          </Toast.Description>
        )}
      </YStack>
    </Toast>
  )
}
