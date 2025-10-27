import CreatePostDialog from '@/components/CreatePost'
import Avatar from '@revit/app/features/common/Avatar'
import { Paragraph, Text, XStack, YStack } from '@revit/ui'
import { useAuthStore } from '@revit/app/store'

const CreatePostButton = () => {
  const { user } = useAuthStore()

  if (!user) {
    return null
  }

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
