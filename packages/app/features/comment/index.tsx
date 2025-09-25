import { Send, Star } from '@tamagui/lucide-icons'
import {
  Button,
  Input,
  Paragraph,
  Spinner,
  Text,
  TextArea,
  Theme,
  useToastController,
  XStack,
  YStack,
} from '@revit/ui'
import { View } from '@revit/ui'
import GetRating from '../common/GetRating'
import { useEffect, useState } from 'react'
import { createCommentApi, fetchPostCommentsApi } from '@revit/api/comment'
import { PostT } from '@revit/shared/types/post'
import Avatar from '../common/Avatar'
import { UserT } from '@revit/shared/types/user'
import { StatusT } from '@revit/shared/types/common'
import { IDLE, LOADING, SUCCESS, FAILED } from '@revit/shared/utils/constants'
import Loader from '../common/Loader'
import { CommentT } from '@revit/shared/types/comment'
import { Platform } from 'react-native'

const Comment = ({ user, post }: { user: UserT; post: PostT }) => {
  const toast = useToastController()
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [status, setStatus] = useState<StatusT>(IDLE)
  const [fetchStatus, setFetchStatus] = useState<StatusT>(LOADING)
  const [comments, setComments] = useState<CommentT[]>([])

  const handleComment = async () => {
    if (rating === 0) {
      toast.show('Empty rating!', {
        message: 'Please provide a rating from 1 to 5.',
        customData: { type: 'error' },
      })
      return
    }
    setStatus(LOADING)
    const error = await createCommentApi({ postId: post.id, rating, content: text })
    setStatus(IDLE)
    if (error) {
      toast.show(Platform.OS === 'web' ? 'Failed to save comment!' : error.message, {
        message: error.message,
        customData: { type: 'error' },
      })
      return
    }
    setStatus(SUCCESS)
  }

  const fetchComments = async () => {
    const { comments, error } = await fetchPostCommentsApi(post.id)
    setFetchStatus(IDLE)

    if (error) {
      toast.show('Failed to fetch comments!', {
        message: error.message,
        customData: { type: 'error' },
      })
    }
    if (comments) {
      setComments(comments)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [])

  return (
    <View borderTopWidth={1} borderTopColor="$black6">
      {/* Existing Comments */}
      {fetchStatus === LOADING ? (
        <YStack justifyContent="center" alignItems="center" py="$3">
          <Spinner />
        </YStack>
      ) : (
        <View pt="$3" pb="$2" px="$3">
          {comments.length > 0 ? (
            comments.map((comment: CommentT) => (
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
                    <Paragraph fontSize="$2" color="$white8">
                      {comment.content}
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
                        <Text fontSize="$1">{comment.rating}</Text>
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
      )}

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
        <XStack width="100%" px="$2" gap="$2">
          <Avatar image={user.avatar} />
          <YStack flex={1} gap="$2.5" bg="$black4" px="$2.5" py="$3" br="$2">
            <XStack alignItems="center">
              <Text mx="$2" fontSize="$2">
                Rate this post:{' '}
              </Text>
              <GetRating size={18} rating={rating} onChange={setRating} />
            </XStack>

            <XStack alignItems="center" gap="$2">
              <TextArea
                flex={1}
                color="$white3"
                placeholder="Add a comment..."
                value={text}
                onChangeText={setText}
                scrollbarWidth="none"
                verticalAlign="top"
              />
              <Theme inverse>
                <Button
                  circular
                  size="$3"
                  fontSize="$2"
                  icon={status === IDLE ? <Send size={16} /> : <Loader status={status} />}
                  disabled={status === LOADING}
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
