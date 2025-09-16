'use client'

import { MoreVertical } from '@tamagui/lucide-icons'
import type { PopoverProps } from 'tamagui'
import { Button, Popover, YStack } from 'tamagui'

export function PostMenu({ Icon, Name, ...props }: PopoverProps & { Icon?: any; Name?: string }) {
  return (
    <Popover size="$4" allowFlip stayInFrame resize {...props}>
      <Popover.Trigger asChild>
        <Button padding="$2" chromeless>
          <MoreVertical color="#d1d5db" size={20} />
        </Button>
      </Popover.Trigger>

      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
      >
        <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

        <YStack gap="$2" width="100%">
          <Popover.Close asChild>
            <Button
              chromeless
              onPress={() => {
                /* Custom code goes here, does not interfere with popover closure */
              }}
              size="$2"
            >
              <Button.Text>Report</Button.Text>
            </Button>
          </Popover.Close>
          <Popover.Close asChild>
            <Button
              chromeless
              onPress={() => {
                /* Custom code goes here, does not interfere with popover closure */
              }}
              size="$2"
            >
              <Button.Text color="$red10">Delete</Button.Text>
            </Button>
          </Popover.Close>
        </YStack>
      </Popover.Content>
    </Popover>
  )
}
