'use client'

import { useState } from 'react'
import { MessageCircle } from '@tamagui/lucide-icons'
import { Button, Card, Image, Paragraph, Text, XStack, YStack } from '@revit/ui'
import Rating from '../common/Rating'
import { PostMenu } from './Menu'
import Comment from '../comment'
import Avatar from '../common/Avatar'
import { PostT } from '@revit/shared/types/post'
import { UserT } from '@revit/shared/types/user'
import { timeAgo } from '@revit/api/utils'
import { Platform } from 'react-native'

const PostCard = ({ user, post }: { user: UserT; post: PostT }) => {
  const [showComments, setShowComments] = useState(false)

  const avgRating = post.comment.length > 0 ? post.comment[0].avgRating : 0
  const commentCount = post.comment.length > 0 ? post.comment[0].commentCount : 0

  return (
    <Card my="$1">
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
      <YStack paddingHorizontal="$3" paddingBottom="$2" gap="$2">
        <Paragraph fontWeight={400}>{post.caption}</Paragraph>

        {/* Tags */}
        <XStack gap="$2" flexWrap="wrap">
          {/* {post.tags.map((tag, index) => (
            <Text key={index} color="$blue9" fontSize="$2" fontWeight="bold">
              #{tag}
            </Text>
          ))} */}
        </XStack>
      </YStack>

      {/* Post Image */}
      <Image
        source={{ uri: post.image}}
        height={Platform.OS === "web" ? "35rem": "500"}
        width="100%"
        alt="feed"
      />

      {/* Post Actions */}
      <Card.Footer
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        py="$1.5"
        paddingHorizontal="$3"
      >
        <Rating rating={avgRating} size={18} />

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
      {showComments && <Comment user={user} post={post} />}
    </Card>
  )
}

export default PostCard
