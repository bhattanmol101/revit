import { Send, Star } from '@tamagui/lucide-icons'
import {
  Button,
  Input,
  Paragraph,
  Text,
  Theme,
  useToastController,
  XStack,
  YStack,
} from '@revit/ui'
import { View } from '@revit/ui'
import GetRating from '../common/GetRating'
import { useState } from 'react'
import { createComment } from '@revit/api/comment'
import { PostT } from '@revit/shared/types/post'
import Avatar from '../common/Avatar'
import { UserT } from '@revit/shared/types/user'
import { ratingSchema } from '@revit/shared/validators/Common'

const Comment = ({ user, post }: { user: UserT; post: PostT }) => {
  const toast = useToastController()
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const handleComment = async () => {
    const result = ratingSchema.safeParse({ rating: rating })
    if (!result.success) {
      setError('Please give rating this post!')
    } else {
      setError('')
    }

    const error = await createComment({ postId: post.id, rating, text })
    if (error) {
      toast.show('Failed to save comment!', {
        message: error.message,
        customData: { type: 'error' },
      })
    }
  }
  return (
    <View borderTopWidth={1} borderTopColor="$black6">
      {/* Existing Comments */}
      <View pt="$3" pb="$2" px="$3">
        {post.comment ? (
          post.comment.map((comment: any) => (
            <YStack key={comment.id} paddingBottom="$2" gap="$0.5">
              <XStack alignItems="center" gap="$2">
                <Avatar image={post.user[0].avatar} />

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
          ))
        ) : (
          <Text fontSize="$2" pt="$2" pb="$3" alignSelf="center">
            No reviews yet, be the first one!
          </Text>
        )}
      </View>

      {/* Add Comment */}
      <YStack
        px="$2"
        py="$3"
        backgroundColor="$black3"
        borderTopWidth={1}
        borderTopColor="$black6"
        borderBottomWidth={1}
        borderBottomColor="$black6"
      >
        <XStack width="100%" px="$2" gap="$3">
          <Avatar image={user.avatar} />
          <YStack flex={1} gap="$2">
            <XStack alignItems="center">
              <Text mx="$1" fontSize="$2">
                Rate this post:{' '}
              </Text>
              <GetRating size={18} rating={rating} setRating={setRating} error={error} />
            </XStack>

            <XStack alignItems="center" gap="$3">
              <Input
                flex={1}
                size="$3"
                placeholder="Add a comment..."
                value={text}
                onChangeText={setText}
              />
              <Theme inverse>
                <Button
                  circular
                  size="$3"
                  fontSize="$2"
                  icon={<Send size={16} />}
                  onPress={handleComment}
                />
              </Theme>
            </XStack>
          </YStack>
        </XStack>
      </YStack>
    </View>
  )
}

export default Comment
