'use client'

import { H4, Paragraph, Text, XStack, YStack } from '@revit/ui'
import CreatePostDialog from '../CreatePost'
import { useSession } from '../Provider/ContextProvider'
import Avatar from '@revit/shared/components/common/Avatar'
import { savePostAction } from '@/app/(home)/home/action'

export default function RightNav() {
  const { user } = useSession()

  if (!user) {
    return
  }

  const handleCreatePost = async (
    caption: string,
    image?: File,
    rating?: number
  ): Promise<void> => {
    await savePostAction(user.id, caption, image)
  }

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
      <YStack alignItems="flex-start" p="$6" gap="$4" backgroundColor="$black3" borderRadius="$5">
        <XStack gap="$3" alignItems="center" justifyContent="center">
          <Avatar size="$6" image={user.profileImage} />
          <YStack gap="$1">
            <Text fontSize="$3" fontWeight={600}>
              {user.name}
            </Text>
            <Paragraph fontSize="$2" fontWeight={400}>
              {user.email}
            </Paragraph>
          </YStack>
        </XStack>
        <CreatePostDialog handleCreatePost={handleCreatePost} />
      </YStack>
    </YStack>
  )
}
