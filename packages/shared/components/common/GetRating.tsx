import { useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Star } from '@tamagui/lucide-icons'
import { XStack } from '@revit/ui'

const GetRating = ({ maxStars = 5, size = 24, onChange }) => {
  const [rating, setRating] = useState(0)

  const handlePress = (value) => {
    setRating(value)
    if (onChange) {
      onChange(value)
    }
  }

  return (
    <XStack alignItems="center" gap="$2">
      {Array.from({ length: maxStars }, (_, index) => {
        const starValue = index + 1
        return (
          <TouchableOpacity key={index} onPress={() => handlePress(starValue)}>
            <Star size={size} color="#fbbf24" fill={starValue <= rating ? '#fbbf24' : ''} />
          </TouchableOpacity>
        )
      })}
    </XStack>
  )
}

export default GetRating
