'use client'

import { MessageCircle, MoreVertical, Share2, Star } from '@tamagui/lucide-icons'
import { Avatar, Button, Card, Image, Text, View, XStack, YStack } from '@revit/ui'
import Comment from './Comment'
import Rating from './Rating'
import StarRating from '../common/Rating'

const PostCard = () => {
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

  // const renderStars = (rating: number) => {
  //   const stars = []
  //   const fullStars = Math.floor(rating)
  //   const hasHalfStar = rating % 1 >= 0.5

  //   for (let i = 0; i < 5; i++) {
  //     if (i < fullStars) {
  //       stars.push(<Star key={i} size={22} color="#fbbf24" fill="#fbbf24" />)
  //     } else if (i === fullStars && hasHalfStar) {
  //       stars.push(<Star key={i} size={22} color="#fbbf24" fill="#fbbf24" />)
  //     } else {
  //       stars.push(<Star key={i} size={22} color="#fbbf24" />)
  //     }
  //   }

  //   return (
  //     <XStack display="flex" gap="$1" alignItems="center" justifyContent="flex-start">
  //       {stars}
  //       <Text fontWeight="$3" marginLeft="$2">
  //         {rating.toFixed(1)}
  //       </Text>
  //     </XStack>
  //   )
  // }

  return (
    <Card>
      {/* Post Header */}
      <Card.Header
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingBottom="$2"
      >
        <XStack alignItems="center" gap="$2">
          <Avatar circular size="$4">
            <Avatar.Fallback borderColor="red" />
            <Avatar.Image src={post.userAvatar} />
          </Avatar>
          <YStack>
            <Text fontWeight="bold">{post.username}</Text>
            <Text fontSize="$3" color="$black11">
              {post.timestamp}
            </Text>
          </YStack>
        </XStack>
        <Button padding="$2" chromeless>
          <MoreVertical color="#d1d5db" size={20} />
        </Button>
      </Card.Header>

      {/* Post Content */}
      <YStack paddingHorizontal="$2" paddingBottom="$3" gap="$2">
        <Text className="text-gray-300 mb-2">{post.content}</Text>

        {/* Tags */}
        <XStack gap="$2" flexWrap="wrap">
          {post.tags.map((tag, index) => (
            <Text key={index} color="$black11" fontSize="$3" fontWeight="bold">
              #{tag}
            </Text>
          ))}
        </XStack>
      </YStack>

      {/* Post Image */}

      <Image
        source={{ width: 200, height: 200, uri: post.image }}
        height="40rem"
        width="100%"
        alt="feed"
      />

      {/* Post Actions */}
      <Card.Footer
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        paddingVertical="$2"
        paddingHorizontal="$3"
      >
        <StarRating rating={post.rating} />

        <XStack padding="$2" gap="$1">
          <Button chromeless padding="$3">
            <MessageCircle color="#d1d5db" size={22} />
            <Text>{post.comments.length}</Text>
          </Button>
          <Button chromeless padding="$3">
            <Share2 color="#d1d5db" size={22} />
            <Text>{post.shares}</Text>
          </Button>
        </XStack>
      </Card.Footer>
      <Rating post={post} />
      <Comment post={post} />
    </Card>
  )
}

export default PostCard
