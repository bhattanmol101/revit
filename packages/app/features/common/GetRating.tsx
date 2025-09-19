'use client'

import { TouchableOpacity } from 'react-native'
import { Star } from '@tamagui/lucide-icons'
import { XStack, YStack } from '@revit/ui'

const GetRating = ({
  size = 24,
  rating,
  setRating,
  error,
}: {
  size: number
  rating: number
  setRating: (value: number) => void
  error?: string
}) => {
  const handleSelect = (value: number) => {
    setRating(value)
  }

  return (
    <YStack gap="$1">
      <XStack alignItems="center" gap="$2">
        {[1, 2, 3, 4, 5].map((value) => (
          <TouchableOpacity key={value} onPress={() => handleSelect(value)}>
            <Star
              size={size}
              color={rating === 0 && error ? 'red' : '#fbbf24'}
              fill={value <= rating ? '#fbbf24' : ''}
            />
          </TouchableOpacity>
        ))}
      </XStack>
    </YStack>
  )
}

export default GetRating
