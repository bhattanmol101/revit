'use client'

import {
  Anchor,
  Button,
  H1,
  Paragraph,
  Card,
  Separator,
  Sheet,
  SwitchThemeButton,
  useToastController,
  XStack,
  YStack,
} from '@revit/ui'
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Platform } from 'react-native'

type HomeScreenProps = {
  email?: string | null
  username?: string | null
  error?: string | null
  onLinkPress?: () => void
  onSignOut?: () => void
}

export function HomeScreen({
  email,
  username,
  error,
  onLinkPress,
  onSignOut,
}: HomeScreenProps) {

  return (
    <YStack
      flex={1}
      justify="center"
      items="center"
      gap="$8"
      p="$4"
      bg="$background"
    >
      <XStack
        position="absolute"
        width="100%"
        t="$6"
        gap="$6"
        justify="center"
        flexWrap="wrap"
        $sm={{ position: 'relative', t: 0 }}
      >
        {Platform.OS === 'web' && <SwitchThemeButton />}
      </XStack>

      <YStack gap="$4">
        <H1
          text="center"
          color="$color12"
        >
          Welcome to Tamagui.
        </H1>
        <Paragraph
          color="$color10"
          text="center"
        >
          Here's a basic starter to show navigating from one screen to another.
        </Paragraph>
        <Separator />
        <Paragraph text="center">
          This screen uses the same code on Next.js and React Native.
        </Paragraph>
        <Separator />
      </YStack>

      <Card
        border='1px solid'
        width="100%"
        maxWidth={460}
        p="$4"
        gap="$3"
      >
        <Paragraph
          text="center"
          fontWeight="700"
        >
          Signed in
        </Paragraph>
        <Paragraph text="center">{email || 'No email found for this account.'}</Paragraph>
        <Paragraph
          text="center"
          color="$color10"
        >
          {username ? `Username: ${username}` : 'No username set on the profile yet.'}
        </Paragraph>
        {error ? (
          <Paragraph
            text="center"
            color="$red10"
          >
            {error}
          </Paragraph>
        ) : null}
        <XStack
          gap="$3"
          justify="center"
          flexWrap="wrap"
        >
          <Button onPress={onLinkPress}>View profile</Button>
          <Button
            onPress={onSignOut}
          >
            Sign out
          </Button>
        </XStack>
      </Card>

      <SheetDemo />
    </YStack>
  )
}

function SheetDemo() {
  const toast = useToastController()

  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)

  return (
    <>
      <Button
        size="$6"
        icon={open ? ChevronDown : ChevronUp}
        circular
        onPress={() => setOpen((x) => !x)}
      />
      <Sheet
        modal
        transition="medium"
        open={open}
        onOpenChange={setOpen}
        snapPoints={[80]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay
          bg="$shadow4"
          transition="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle bg="$color8" />
        <Sheet.Frame
          items="center"
          justify="center"
          gap="$10"
          bg="$color2"
        >
          <XStack gap="$2">
            <Paragraph text="center">Made by</Paragraph>
            <Anchor
              color="$blue10"
              href="https://twitter.com/natebirdman"
              target="_blank"
            >
              @natebirdman,
            </Anchor>
            <Anchor
              color="$blue10"
              href="https://github.com/tamagui/tamagui"
              target="_blank"
              rel="noreferrer"
            >
              give it a ⭐️
            </Anchor>
          </XStack>

          <Button
            size="$6"
            circular
            icon={ChevronDown}
            onPress={() => {
              setOpen(false)
              toast.show('Sheet closed!', {
                message: 'Just showing how toast works...',
              })
            }}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
