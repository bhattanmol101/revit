'use client'

import React, { useState } from 'react'
import { ScrollView, Alert, Dimensions } from 'react-native'
import { Star, Image as ImageIcon, Send, X } from '@tamagui/lucide-icons'
import { Button, Image, Input, Text, TextArea, View, XStack, YStack } from '@revit/ui'

const CreatePost = () => {
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedForum, setSelectedForum] = useState('Best Coffee Shops in NYC')
  const [imageUri, setImageUri] = useState<string | null>(null)

  // Mock data for forums
  const forums = [
    'Best Coffee Shops in NYC',
    'Smartphone Reviews 2023',
    'Fitness Apps Comparison',
    'Travel Destinations',
    'Restaurant Reviews',
  ]

  // Screen width for image sizing
  const screenWidth = Dimensions.get('window').width

  const handleStarPress = (starIndex: number) => {
    setRating(starIndex)
  }

  const handleCreateReview = () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please provide a rating')
      return
    }

    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your review')
      return
    }

    if (!content.trim()) {
      Alert.alert('Error', 'Please write your review content')
      return
    }

    Alert.alert(
      'Review Posted!',
      'Your review has been successfully posted. Thank you for your contribution!',
      [{ text: 'OK', onPress: () => console.log('Review created') }]
    )
  }

  const renderStars = (interactive: boolean = true) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Button
          key={i}
          onPress={() => interactive && handleStarPress(i)}
          disabled={!interactive}
          chromeless
          padding="$2"
        >
          <Star
            size={32}
            color={i <= rating ? '#FFD700' : '#E5E7EB'}
            fill={i <= rating ? '#FFD700' : 'none'}
          />
        </Button>
      )
    }
    return <XStack gap="$0.5">{stars}</XStack>
  }

  return (
    <YStack flex={1}>
      <ScrollView>
        {/* Review Image Section */}
        <YStack rounded="$5" shadowOpacity={20} padding="$4" gap="$2">
          <XStack items="center" gap="$2">
            <ImageIcon size={20} color="#1d4ed8" />
            <Text fontWeight="$3">Review Image</Text>
          </XStack>

          {imageUri ? (
            <View position="relative">
              <Image
                source={{ width: screenWidth - 48, height: 600, uri: imageUri }}
                rounded="$10"
              />
              <Button
                position="absolute"
                top={2}
                right={2}
                backgroundColor="$red10"
                rounded="$10"
                padding="$1"
                onPress={() => setImageUri(null)}
              >
                <X size={14} color="white" />
              </Button>
            </View>
          ) : (
            <Button
              borderWidth={2}
              borderStyle="dashed"
              rounded="$5"
              items="center"
              justify="center"
              onPress={() => {
                // In a real app, this would open the image picker
                // For demo purposes, we'll use a placeholder image
                setImageUri(
                  'https://images.unsplash.com/photo-1517340073101-289191978ae8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fDMlMjBncmFwaGljc3xlbnwwfHwwfHx8MA%3D%3D'
                )
              }}
              height="$12"
            >
              <ImageIcon size={48} color="#d1d5db" />
              <Text>Tap to upload image</Text>
            </Button>
          )}
        </YStack>

        {/* Review Rating Section */}
        <YStack rounded="$5" shadowOpacity={20} padding="$4">
          <Text>Your Rating</Text>
          <YStack items="center">
            {renderStars()}
            <Text color="$accent11">
              {rating === 0 ? 'Select a rating' : `${rating} star${rating > 1 ? 's' : ''}`}
            </Text>
          </YStack>
        </YStack>

        {/* Review Details Section */}
        <YStack rounded="$5" shadowOpacity={20} padding="$4">
          <Text fontWeight="bold" fontSize={20}>
            Review Details
          </Text>

          {/* Title Input */}
          <YStack gap="$4">
            <YStack gap="$1">
              <Text>Review Title *</Text>
              <Input
                width="100%"
                borderWidth={1}
                placeholder="Give your review a title..."
                value={title}
                onChangeText={setTitle}
              />
            </YStack>

            {/* Content Input */}
            <YStack gap="$1">
              <Text>Review Content *</Text>
              <TextArea
                width="100%"
                borderWidth={1}
                placeholder="Share your experince..."
                value={title}
                onChangeText={setTitle}
              />
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>

      {/* Post Button */}
      <View paddingHorizontal="$3" paddingBottom="$5">
        <Button onPress={handleCreateReview} size="$4">
          <Send size={20} />
          <Text className="text-md">Post Review</Text>
        </Button>
      </View>
    </YStack>
  )
}

export default CreatePost
