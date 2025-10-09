import CreatePostDialog from '@/components/CreatePost'
import Avatar from '@revit/app/features/common/Avatar'
import { UserT } from '@revit/shared/types/user'
import { Paragraph, Text, XStack, YStack } from '@revit/ui'
import React from 'react'

const CreatePostButton = ({ user }: { user: UserT }) => {
  return (
    <YStack alignItems="flex-start" p="$6" gap="$4" backgroundColor="$black3" borderRadius="$5">
      <XStack gap="$3" alignItems="center" justifyContent="center">
        <Avatar size="$6" image={user.avatar} />
        <YStack gap="$1">
          <Text fontSize="$3" fontWeight={600}>
            {user.name}
          </Text>
          <Paragraph fontSize="$2" fontWeight={400}>
            {user.email}
          </Paragraph>
        </YStack>
      </XStack>
      <CreatePostDialog />
    </YStack>
  )
}

export default CreatePostButton
