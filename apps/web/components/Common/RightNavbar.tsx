'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Avatar, Button, View, XStack, YStack } from '@revit/ui'
import { ClipboardEdit } from '@tamagui/lucide-icons'
import CreatePostDialog from '../CreatePost'

export default function RightNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleRouteClick = (pathname: string) => router.push(pathname)

  return (
    <YStack
      borderLeftWidth={1}
      minHeight="100%"
      borderLeftColor="$black4"
      pt="$8"
      pb="$12"
      px="$6"
      justifyContent="space-between"
    >
      <XStack
        minWidth="100%"
        gap="$2"
        backgroundColor="$black3"
        p="$6"
        borderRadius="$5"
        alignItems="center"
        justifyContent="center"
      >
        <Avatar circular size="$6">
          <Avatar.Fallback />
          <Avatar.Image
            source={{
              uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
            }}
          />
        </Avatar>
        {/* <Button flex={1} borderRadius="$5" variant="outlined" py="$5">
          <Button.Icon>
            <ClipboardEdit size={24} />
          </Button.Icon>
          <Button.Text>Create a Revit Post!</Button.Text>
        </Button> */}
        <CreatePostDialog />
      </XStack>
    </YStack>
  )
}
