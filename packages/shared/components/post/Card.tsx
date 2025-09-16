'use client'

import { useState } from 'react'
import { MessageCircle } from '@tamagui/lucide-icons'
import { Avatar, Button, Card, Image, Paragraph, Text, XStack, YStack } from '@revit/ui'
import Rating from '../common/Rating'
import { PostMenu } from './Menu'
import Comment from '../comment'

const PostCard = () => {
  const [showComments, setShowComments] = useState(false)
  const post = {
    id: '1',
    username: 'Alex Johnson',
    userAvatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&auto=format&fit=crop',
    timestamp: '2 hours ago',
    content: 'Just launched our new product! Excited to see what you all think. Feedback welcome!',
    image: 'https://picsum.photos/200/300',
    likes: 243,
    shares: 12,
    isLiked: false,
    tags: ['Product Launch', 'Tech'],
    rating: 4,
    comments: [
      {
        id: '1',
        username: 'traveler_girl',
        text: 'Looks amazing! Where is this?',
      },
      {
        id: '2',
        username: 'nature_lover',
        text: 'I want to visit this place too!',
      },
    ],
  }

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
          <Avatar circular size="$3">
            <Avatar.Fallback borderColor="red" />
            <Avatar.Image src={post.userAvatar} />
          </Avatar>
          <YStack>
            <Text fontSize="$2">{post.username}</Text>
            <Text fontSize="$1" color="$black11">
              {post.timestamp}
            </Text>
          </YStack>
        </XStack>
        <PostMenu placement="bottom" />
      </Card.Header>

      {/* Post Content */}
      <YStack paddingHorizontal="$3" paddingBottom="$2" gap="$2">
        <Paragraph fontWeight={400}>{post.content}</Paragraph>

        {/* Tags */}
        <XStack gap="$2" flexWrap="wrap">
          {post.tags.map((tag, index) => (
            <Text key={index} color="$blue9" fontSize="$2" fontWeight="bold">
              #{tag}
            </Text>
          ))}
        </XStack>
      </YStack>

      {/* Post Image */}
      <Image
        source={{ width: 500, height: 500, uri: post.image }}
        height="35rem"
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
        <Rating rating={post.rating} size={18} />

        <Button
          chromeless
          onPress={() => {
            setShowComments(!showComments)
          }}
        >
          <Button.Icon>
            <MessageCircle color="#d1d5db" size={18} />
          </Button.Icon>
          <Button.Text>{post.comments.length}</Button.Text>
        </Button>
      </Card.Footer>
      {showComments && <Comment post={post} />}
    </Card>
  )
}

export default PostCard
