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
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={0}
      opacity={1}
      scale={1}
      animation="quick"
      backgroundColor={isSuccess ? '$green11' : isDanger ? '$red11' : '$background'}
    >
      <YStack py="$1.5" px="$2">
        <Toast.Title color={isSuccess ? '$green6' : isDanger ? '$red6' : '$background'}>
          {currentToast.title}
        </Toast.Title>
        {!!currentToast.message && (
          <Toast.Description color="white">{currentToast.message}</Toast.Description>
        )}
      </YStack>
    </Toast>
  )
}
