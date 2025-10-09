import { Star } from '@tamagui/lucide-icons'
import { Paragraph, Text, View, XStack, YStack } from '@revit/ui'
import Avatar from '../common/Avatar'
import { CommentT } from '@revit/shared/types/comment'
import Rating from '../common/Rating'

const CommentCard = ({ comment }: { comment: CommentT }) => {
  return (
    <View>
      <YStack key={comment.id} paddingBottom="$2" gap="$0.5">
        <XStack alignItems="center" gap="$2">
          <Avatar image={comment.user.avatar} />
          <YStack
            borderRadius="$5"
            backgroundColor="$black5"
            px="$3"
            py="$2"
            gap="$1"
            position="relative"
          >
            <Text fontSize={13} fontWeight="$3">
              {comment.user.name}
            </Text>

            <Paragraph fontSize="$2" color="$white8" display={comment.content ? 'block' : 'none'}>
              {comment.content}
            </Paragraph>

            {comment.content ? (
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
                  <Text fontSize="$1">{comment.rating}</Text>
                </XStack>
              </View>
            ) : (
              <View mt="$1">
                <Rating size={12} fontSize="$2" rating={comment.rating} />
              </View>
            )}
          </YStack>
        </XStack>
      </YStack>
    </View>
  )
}

export default CommentCard
