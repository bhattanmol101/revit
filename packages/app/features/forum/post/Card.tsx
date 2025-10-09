'use client'

import { useState } from 'react'
import { MessageCircle, Star } from '@tamagui/lucide-icons'
import { Button, Card, ImageCarousel, Paragraph, Text, XStack, YStack } from '@revit/ui'
import Comment from '../../comment'
import { ForumPostT } from '@revit/shared/types/forum'
import { timeAgo } from '@revit/api/utils'
import { PostMenu } from '../../post/Menu'
import Avatar from '../../common/Avatar'
import { UserT } from '@revit/shared/types/user'

const ForumPostCard = ({ user, post }: { user: UserT; post: ForumPostT }) => {
  const [showComments, setShowComments] = useState(false)

  const avgRating = post.comment.length > 0 ? post.comment[0].avgRating : 0
  const commentCount = post.comment.length > 0 ? post.comment[0].commentCount : 0

  return (
    <Card my="$1" bg="$black3">
      {/* Post Header */}
      <Card.Header
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingBottom="$2"
      >
        <XStack alignItems="center" gap="$2">
          <Avatar size="$3" image={post.user.avatar} />
          <YStack>
            <Text fontSize="$2">{post.user.name}</Text>
            <Text fontSize="$1" color="$black11">
              {timeAgo(post.createdAt)}
            </Text>
          </YStack>
        </XStack>
        <PostMenu placement="bottom" />
      </Card.Header>
      {/* Post Content */}
      <YStack paddingHorizontal="$3" paddingBottom="$2">
        <Paragraph fontWeight={400}>{post.caption}</Paragraph>

        {/* Tags */}
        {/*<XStack gap="$2" flexWrap="wrap">
        {post.tags.map((tag, index) => (
            <Text key={index} color="$blue9" fontSize="$2" fontWeight="bold">
              #{tag}
            </Text>
          ))}
        </XStack>*/}
      </YStack>
      {/* Post Image */}
      <ImageCarousel images={post.images} />
      {/* Post Actions */}
      <Card.Footer display="flex" alignItems="center" gap="$1" py="$2" paddingHorizontal="$3">
        <Button
          py="$1"
          chromeless
          onPress={() => {
            setShowComments(!showComments)
          }}
        >
          <Button.Icon>
            <Star size="$1" color="#fbbf24" fill="#fbbf24" />
          </Button.Icon>
          <Button.Text>{avgRating}</Button.Text>
        </Button>

        <Button
          chromeless
          onPress={() => {
            setShowComments(!showComments)
          }}
        >
          <Button.Icon>
            <MessageCircle color="#d1d5db" size={18} />
          </Button.Icon>
          <Button.Text>{commentCount}</Button.Text>
        </Button>
      </Card.Footer>
      {showComments && <Comment post={post} type="forum" />}
    </Card>
  )
}

export default ForumPostCard
