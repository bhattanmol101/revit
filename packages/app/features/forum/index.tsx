'use client'

import { Alert } from 'react-native'
import { Users } from '@tamagui/lucide-icons'
import { Card, Image, Separator, Text, View, XStack, YStack } from '@revit/ui'
import Rating from '../common/Rating'
import ForumPostCard from './post/Card'

const Forum = () => {
  const forums = [
    {
      id: '1',
      title: 'Best Coffee Shops in NYC',
      description: 'Share your experiences and rate coffee shops in the city',
      category: 'Food & Dining',
      participants: 142,
      posts: 28,
      image:
        'https://images.unsplash.com/photo-1613759612065-d5971d32ca49?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8TWFya2V0aW5nJTIwYnJhbmRpbmd8ZW58MHx8MHx8fDA%3D',
      creator: 'coffee_lover',
      rating: 4.7,
    },
  ]

  const handleCreateForum = () => {
    Alert.alert('Create Forum', 'This would open the create forum form')
  }

  return (
    <View flex={1}>
      <ForumCard forum={forums[0]} />
      <XStack my="$2" gap="$3" alignItems="center">
        <Separator />
        <Text fontSize="$3" color="$black11">
          Posts
        </Text>
        <Separator />
      </XStack>
      <ForumPostCard />
    </View>
  )
}

const ForumCard = ({ forum }: { forum: any }) => {
  return (
    <Card width="100%" my="$1">
      <Card.Header
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingBottom="$1"
      >
        <Image source={{ uri: forum.image }} width="100%" height={200} alt="forum image" />
      </Card.Header>
      <YStack p="$3" gap="$3">
        <XStack justifyContent="space-between" alignItems="flex-start">
          <YStack flex={1} gap="$1">
            <Text fontSize="$3" fontWeight="bold">
              {forum.title}
            </Text>
            <Text fontSize="$2" color="$white8">
              {forum.description}
            </Text>
          </YStack>
          <View backgroundColor="$blue10" borderRadius={10} py="$1" px="$2">
            <Text fontSize="$1" fontWeight={600}>
              {forum.category}
            </Text>
          </View>
        </XStack>

        <XStack alignItems="center">
          <Users size={16} color="#9ca3af" />
          <Text color="$black11" fontSize="$2">
            {forum.participants} participants • {forum.posts} posts
          </Text>
        </XStack>

        <XStack justifyContent="space-between" alignItems="center">
          <XStack>
            <Rating rating={forum.rating} size={16} fontSize="$2" />
          </XStack>
          <Text color="$black11" fontSize="$2" fontWeight="bold">
            by {forum.creator}
          </Text>
        </XStack>
      </YStack>
    </Card>
  )
}

export default Forum
