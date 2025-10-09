'use client'

import { useEffect, useState } from 'react'
import { Button, Spinner, Text, UniversalList, View, XStack, YStack } from '@revit/ui'
import PostCard from '../post/Card'
import EditProfileDialog from './Edit'
import { UserProfileT, UserT } from '@revit/shared/types/user'
import { fetchUserPostsApi } from '@revit/api/post'
import Avatar from '../common/Avatar'
import { IDLE, LOADING, SUCCESS } from '@revit/shared/utils/constants'
import { StatusT } from '@revit/shared/types/common'
import { PostT } from '@revit/shared/types/post'
import Loader from '../common/Loader'
import { fetchUserProfileByIdApi } from '@revit/api/user'
import { getJoinedDate } from '@revit/shared/utils'
import { Platform } from 'react-native'
import { Edit3 } from '@tamagui/lucide-icons'
import { useRouter } from 'solito/navigation'

export default function Profile({ userId, user }: { userId: string; user?: UserT }) {
  const router = useRouter()

  const [userStatus, setUserStatus] = useState<StatusT>(user ? IDLE : LOADING)
  const [status, setStatus] = useState<StatusT>(LOADING)
  const [posts, setPosts] = useState<PostT[]>([])
  const [userProfile, setUserProfile] = useState<UserProfileT | undefined>(
    user ? { ...user, postCount: -1 } : undefined
  )

  const handleMobileEditProfile = () => {
    router.push('/profile/edit')
  }

  const fetchUserProfile = async () => {
    const { user: userProfile, error } = await fetchUserProfileByIdApi(userId)
    if (error) {
      return
    }
    setUserStatus(IDLE)
    if (userProfile) {
      setUserProfile(userProfile)
    }
  }

  const fetchPosts = async () => {
    const { posts, error } = await fetchUserPostsApi(userId)
    setStatus(IDLE)
    if (error) {
      return
    }
    if (posts) {
      setPosts(posts)
      setStatus(SUCCESS)
    }
  }

  useEffect(() => {
    fetchUserProfile()
    fetchPosts()
  }, [])

  if (userStatus === LOADING) {
    return (
      <View flex={1} justifyContent={'center'} alignContent={'center'}>
        <Loader status={userStatus} />
      </View>
    )
  }

  if (!userProfile) {
    return <></>
  }

  return (
    <UniversalList
      listHeaderComponent={
        <View mb="$1">
          {/* Header Section */}
          <YStack alignItems="center" pt="$3" pb="$5" gap="$4">
            <Avatar size="$10" image={userProfile.avatar} />

            <YStack justifyContent="center" alignItems="center" gap="$1">
              <Text fontSize="$5" fontWeight="bold">
                {userProfile.name}
              </Text>
              <Text fontSize="$3" textAlign="center" color="$black11">
                {userProfile.bio}
              </Text>
            </YStack>

            {user &&
              (Platform.OS !== 'web' ? (
                <Button variant="outlined" size="$2" onPress={handleMobileEditProfile}>
                  <Button.Icon>
                    <Edit3 size={14} color="white" />
                  </Button.Icon>
                  <Button.Text>Edit Profile</Button.Text>
                </Button>
              ) : (
                <EditProfileDialog user={user} />
              ))}
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
              {userProfile.postCount >= 0 ? (
                <Text fontSize="$3" fontWeight="bold">
                  {userProfile.postCount}
                </Text>
              ) : (
                <Spinner size="small" />
              )}
              <Text fontSize="$2" color="$black11">
                Posts
              </Text>
            </YStack>

            <YStack alignItems="center" gap="$1">
              <Text fontSize="$3">{getJoinedDate(userProfile.createdAt)}</Text>
              <Text fontSize="$2" color="$black11">
                Joined
              </Text>
            </YStack>
          </XStack>
          {status === LOADING && <Loader status={status} />}
        </View>
      }
      data={posts}
      status={status}
      renderItem={(item: PostT) => <PostCard key={item.id} user={user as UserT} post={item} />}
    />
  )
}
