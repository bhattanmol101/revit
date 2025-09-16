import { Send, Star } from '@tamagui/lucide-icons'
import { Avatar, Button, Input, Paragraph, Text, XStack, YStack } from '@revit/ui'
import { View } from '@revit/ui'
import GetRating from '../common/GetRating'
import Rating from '../common/Rating'

const Comment = ({ post }: { post: any }) => {
  const handleRatingChange = (value: number) => {
    console.log('User selected rating:', value)
  }

  return (
    <View borderTopWidth={1} borderTopColor="$black6">
      {/* Existing Comments */}
      <View pt="$3" pb="$2" px="$3">
        {post.comments.map((comment: any) => (
          <YStack key={comment.id} paddingBottom="$2" gap="$0.5">
            <XStack alignItems="center" gap="$2">
              <Avatar size="$3" circular>
                <Avatar.Fallback borderColor="red" />
                <Avatar.Image src={post.userAvatar} />
              </Avatar>
              <YStack
                borderRadius="$5"
                backgroundColor="$black5"
                px="$3"
                py="$2"
                gap="$1"
                position="relative"
              >
                <Text fontSize={13} fontWeight="$3">
                  {comment.username}
                </Text>
                <Paragraph fontSize="$2" color="$white8">
                  {comment.text}
                </Paragraph>
                <View position="absolute" top={0} right={0}>
                  <XStack
                    gap="$1"
                    px="$2"
                    py="$1"
                    backgroundColor="$black7"
                    borderRadius="$2"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Star size={12} color="#fbbf24" fill="#fbbf24" />
                    <Text fontSize="$1">4.5</Text>
                  </XStack>
                </View>
              </YStack>
            </XStack>
          </YStack>
        ))}
      </View>

      {/* Add Comment */}
      <YStack
        gap="$2"
        px="$2"
        pt="$3"
        pb="$2"
        backgroundColor="$black3"
        borderTopWidth={1}
        borderTopColor="$black6"
      >
        <XStack alignItems="center" ml="$2">
          <Text mr="$1" fontSize="$3">
            Rate this post:{' '}
          </Text>
          <GetRating size={18} onChange={handleRatingChange} />
        </XStack>
        <XStack alignItems="center" paddingTop="$2" gap="$2">
          <Input flex={1} borderWidth={1} placeholder="Add a comment..." />
          <Button circular icon={Send} padding="$2" onPress={() => {}} />
        </XStack>
      </YStack>
    </View>
  )
}

export default Comment
