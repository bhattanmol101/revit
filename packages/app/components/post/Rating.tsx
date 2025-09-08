import React, { useState } from 'react'
import { Send, Star } from '@tamagui/lucide-icons'
import { Button, Text, XStack, YStack } from '@revit/ui'

const Rating = ({ post }: { post: any }) => {
  const [userRating, setUserRating] = useState<{ [key: string]: number }>({})
  const handleRating = (postId: string, rating: number) => {
    setUserRating((prev) => ({
      ...prev,
      [postId]: rating,
    }))
  }

  const renderRatingStars = (postId: string, currentRating: number) => {
    const stars = []
    const userRatingValue = userRating[postId] || 0

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Button
          key={i}
          onPress={() => handleRating(postId, i)}
          icon={
            <Star
              size={20}
              color={i <= userRatingValue ? '#FFD700' : '#FFD700'}
              fill={i <= userRatingValue ? '#FFD700' : 'none'}
            />
          }
          padding="$2"
          chromeless
        />
      )
    }

    return <XStack marginTop="$1">{stars}</XStack>
  }

  return (
    <YStack paddingVertical="$1" paddingHorizontal="$2">
      <Text className="font-medium ml-1 text-lg">Revit this post</Text>
      <XStack justify="space-between">
        {renderRatingStars(post.id, post.rating)}
        <Button circular padding="$1" icon={Send} onPress={() => {}} />
      </XStack>
    </YStack>
  )
}

export default Rating
