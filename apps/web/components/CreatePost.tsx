'use client'

import { ChevronRight, X, ClipboardEdit, ChevronLeft } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Button, Dialog, Unspaced, YStack, View, Text, XStack } from '@revit/ui'
import CreatePost from '@revit/shared/components/post/Create'

const CreatePostDialog = () => {
  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        <Button flex={1} borderRadius="$5" variant="outlined" py="$5">
          <Button.Icon>
            <ClipboardEdit size={24} />
          </Button.Icon>
          <Button.Text>Create a Revit Post!</Button.Text>
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal width={300}>
        <Dialog.Overlay
          key="overlay"
          backgroundColor="$shadowColor"
          animateOnly={['transform', 'opacity']}
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.FocusScope focusOnIdle>
          <Dialog.Content
            bordered
            paddingVertical="$4"
            paddingHorizontal="$6"
            elevate
            minWidth={600}
            minHeight={250}
            borderRadius="$6"
            key="content"
            animateOnly={['transform', 'opacity']}
            animation={[
              'quick',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: 20, opacity: 0 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            gap="$4"
          >
            <Dialog.Title fontSize="$2">Create your Revit Post</Dialog.Title>

            <CreatePost />

            <Unspaced>
              <Dialog.Close asChild>
                <Button position="absolute" right="$3" size="$2" circular icon={X} />
              </Dialog.Close>
            </Unspaced>
          </Dialog.Content>
        </Dialog.FocusScope>
      </Dialog.Portal>
    </Dialog>
  )
}

export default CreatePostDialog
