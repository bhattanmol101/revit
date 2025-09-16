'use client'

import React, { useState } from 'react'
import { Alert } from 'react-native'
import { Camera, Edit3, Star, Users, Image as ImageIcon } from '@tamagui/lucide-icons'
import { Button, Image, ListItemSubtitle, Text, View, XStack, YStack } from '@revit/ui'
import PostCard from '../post/Card'
import EditProfileDialog from './Edit'
import { UserT } from '../../types/user'

export default function Profile({ user }: { user: UserT }) {
  const [userData] = useState({
    name: 'Alex Morgan',
    bio: 'Digital creator & photographer 📸\nLove to capture moments that last forever',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330? crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&w=200',
    posts: 42,
    averageRating: 4.7,
    followers: 1248,
  })

  const [userContent] = useState([
    {
      id: 1,
      image:
        'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      rating: 4.8,
    },
    {
      id: 2,
      image:
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      rating: 5.0,
    },
    {
      id: 3,
      image:
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      rating: 4.5,
    },
    {
      id: 4,
      image:
        'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      rating: 4.9,
    },
    {
      id: 5,
      image:
        'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      rating: 4.3,
    },
    {
      id: 6,
      image:
        'https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      rating: 4.7,
    },
  ])

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'This would open the edit profile screen')
  }

  const handleSettings = () => {
    Alert.alert('Settings', 'This would open the settings screen')
  }

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive' },
    ])
  }

  return (
    <View flex={1}>
      {/* Header Section */}
      <YStack alignItems="center" pt="$3" pb="$5" gap="$4">
        <Image
          source={{ uri: user.profileImage ? user.profileImage : '' }}
          height={100}
          width={100}
          borderRadius={50}
          borderColor="$white0"
          alt="user image"
        />

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
            {userData.posts}
          </Text>
          <Text fontSize="$2" color="$black11">
            Posts
          </Text>
        </YStack>

        <YStack alignItems="center" gap="$1">
          <XStack alignItems="center" gap="$2">
            <Star size={16} color="#FFC107" fill="#FFC107" />
            <Text fontSize="$3" fontWeight="bold">
              {userData.averageRating}
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
              {userData.followers}
            </Text>
          </XStack>
          <Text fontSize="$2" color="$black11">
            Followers
          </Text>
        </YStack>
      </XStack>

      {/* Content Grid */}
      <YStack py="$2">
        {userContent.map((item) => (
          <PostCard key={item.id} />
        ))}
      </YStack>
    </View>
  )
}
