import { Send } from '@tamagui/lucide-icons'
import { Avatar, Button, Input, Text, XStack, YStack } from '@revit/ui'

const Comment = ({ post }: { post: any }) => {
  return (
    <YStack paddingVertical="$2" paddingHorizontal="$3">
      {/* Existing Comments */}
      {post.comments.map((comment: any) => (
        <YStack key={comment.id} paddingBottom="$2" gap="$0.5">
          <XStack items="center" gap="$1">
            <Avatar size="$3" circular>
              <Avatar.Fallback borderColor="$accent1" />
              <Avatar.Image src={post.userAvatar} />
            </Avatar>
            <YStack
              backgroundColor="$accent12"
              rounded="$5"
              paddingHorizontal="$3"
              paddingVertical="$1"
              marginLeft={2}
              gap="$1"
            >
              <Text fontSize="$3" fontWeight="$3">
                {comment.username}
              </Text>
              <Text fontSize="$2" color="$black10">
                {comment.text}
              </Text>
            </YStack>
          </XStack>
        </YStack>
      ))}

      {/* Add Comment */}
      <XStack items="center" paddingTop="$2" gap="$2">
        <Input flex={1} borderWidth={1} placeholder="Add a comment..." />
        <Button circular icon={Send} padding="$2" onPress={() => {}} />
      </XStack>
    </YStack>
  )
}

export default Comment
