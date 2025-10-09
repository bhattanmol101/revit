import { Send } from '@tamagui/lucide-icons'
import {
  Button,
  Text,
  TextArea,
  Theme,
  UniversalList,
  useToastController,
  View,
  XStack,
  YStack,
} from '@revit/ui'
import GetRating from '../common/GetRating'
import { useEffect, useState } from 'react'
import { PostT } from '@revit/shared/types/post'
import Avatar from '../common/Avatar'
import { StatusT } from '@revit/shared/types/common'
import { IDLE, LOADING, SUCCESS } from '@revit/shared/utils/constants'
import Loader from '../common/Loader'
import { CommentT } from '@revit/shared/types/comment'
import { ForumPostT } from '@revit/shared/types/forum'
import { useCommentStore } from '../../store/comment.store'
import CommentCard from './Card'
import { useAuthStore } from '../../store'

const Comment = ({
  post,
  type = 'post',
}: {
  post: PostT | ForumPostT
  type?: 'post' | 'forum'
}) => {
  const toast = useToastController()
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [status, setStatus] = useState<StatusT>(IDLE)

  const { user } = useAuthStore()

  if (!user) {
    return
  }

  const { loadingByPost, commentsByPost, fetchComments, addComment } = useCommentStore()

  const clearComment = () => {
    setText('')
    setRating(0)
    setStatus(IDLE)
  }

  const handleComment = async () => {
    if (rating === 0) {
      toast.show('Empty rating!', {
        message: 'Please provide a rating from 1 to 5.',
        customData: { type: 'error' },
      })
      return
    }
    setStatus(LOADING)

    const error = await addComment(post.id, { postId: post.id, rating, content: text, type })

    clearComment()
    if (error) {
      toast.show(error.message, {
        message: 'Something went wrong! Please try again later.',
        customData: { type: 'error' },
      })
      return
    }
    setStatus(SUCCESS)
  }

  useEffect(() => {
    fetchComments(post.id, { type, refresh: true })
  }, [post.id])

  const renderComment = (comment: CommentT) => <CommentCard comment={comment} />

  const comments = commentsByPost[post.id] || []

  const height =
    comments.length === 0 ? 60 : comments.length < 2 ? 100 : comments.length < 4 ? 200 : 400

  return (
    <View flex={1} borderTopWidth={1} borderTopColor="$black6">
      {/* Existing Comments */}
      <View pt="$2" height={height}>
        <UniversalList
          loading={loadingByPost[post.id]}
          data={comments}
          renderItem={renderComment}
          emptyText="No reviews yet, be the first one!"
        />
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
                height="$4.5"
                value={text}
                numberOfLines={10}
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
