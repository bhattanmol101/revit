'use client'

import { useEffect, useState } from 'react'
import { Star, Users } from '@tamagui/lucide-icons'
import { Text, View, XStack, YStack } from '@revit/ui'
import PostCard from '../post/Card'
import EditProfileDialog from './Edit'
import { UserT } from '@revit/shared/types/user'
import { fetchUserPostsApi } from '@revit/api/post'
import Avatar from '../common/Avatar'
import { IDLE, LOADING, SUCCESS } from '@revit/shared/utils/constants'
import { StatusT } from '@revit/shared/types/common'
import { PostT } from '@revit/shared/types/post'
import Loader from '../common/Loader'

export default function Profile({ user }: { user: UserT }) {
  const [status, setStatus] = useState<StatusT>(LOADING)
  const [posts, setPosts] = useState<PostT[]>([])

  const fetchPosts = async () => {
    const { posts, error } = await fetchUserPostsApi(user.id)
    setStatus(IDLE)
    if (error) {
    }
    if (posts) {
      setPosts(posts)
      setStatus(SUCCESS)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <View flex={1}>
      {/* Header Section */}
      <YStack alignItems="center" pt="$3" pb="$5" gap="$4">
        <Avatar size="$10" image={user.avatar} />

        <YStack justifyContent="center" alignItems="center" gap="$1">
          <Text fontSize="$5" fontWeight="bold">
            {user.name}
          </Text>
          <Text fontSize="$3" textAlign="center" color="$black11">
            {user.bio}
          </Text>
        </YStack>

        <EditProfileDialog user={user} />
      </YStack>

      {/* Stats Section */}
      <XStack
        justifyContent="space-around"
        py="$2"
        borderBottomWidth={1}
        borderBottomColor="$black5"
        borderTopWidth={1}
        borderTopColor="$black5"
      >
        <YStack alignItems="center" gap="$1">
          <Text fontSize="$3" fontWeight="bold">
            {/* {user.posts} */}
          </Text>
          <Text fontSize="$2" color="$black11">
            Posts
          </Text>
        </YStack>

        <YStack alignItems="center" gap="$1">
          <XStack alignItems="center" gap="$2">
            <Star size={16} color="#FFC107" fill="#FFC107" />
            <Text fontSize="$3" fontWeight="bold">
              {/* {userData.averageRating} */}
            </Text>
          </XStack>
          <Text fontSize="$2" color="$white5">
            Rating
          </Text>
        </YStack>

        <YStack alignItems="center" gap="$1">
          <XStack alignItems="center" gap="$2">
            <Users size={16} color="white" />
            <Text fontSize="$3" fontWeight="bold">
              {/* {userData.followers} */}
            </Text>
          </XStack>
          <Text fontSize="$2" color="$black11">
            Followers
          </Text>
        </YStack>
      </XStack>

      {/* Content Grid */}
      <YStack py="$2">
        {status === LOADING && <Loader status={status} />}
        {status === SUCCESS &&
          posts.map((item) => <PostCard key={item.id} user={user} post={item} />)}
      </YStack>
    </View>
  )
}
