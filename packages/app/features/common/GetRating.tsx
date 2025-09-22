'use client'

import { useState } from 'react'
import { YStack, XStack } from 'tamagui'
import { Star } from '@tamagui/lucide-icons'
import { motion } from 'framer-motion'
import { Platform, Pressable } from 'react-native'

type RatingProps = {
  size?: number
  max?: number
  rating: number
  onChange: (rating: number) => void
}

const GetRating = ({ size = 24, max = 5, rating = 0, onChange }: RatingProps) => {
  const [hovered, setHovered] = useState<number | null>(null)
  const [selected, setSelected] = useState<number>(rating)

  const MotionWrapper = motion(YStack)

  const getFillType = (index: number): 'full' | 'empty' => {
    const rating = hovered ?? selected
    return rating >= index + 1 ? 'full' : 'empty'
  }

  const handlePress = (index: number) => {
    const ratingValue = index + 1 // whole star only
    setSelected(ratingValue)
    onChange?.(ratingValue)
  }

  return (
    <XStack gap="$2">
      {Array.from({ length: max }).map((_, i) => {
        const fillType = getFillType(i)

        return (
          <Pressable
            key={i}
            onPress={() => handlePress(i)}
            onHoverIn={() => Platform.OS === 'web' && setHovered(i + 1)}
            onHoverOut={() => Platform.OS === 'web' && setHovered(null)}
          >
            <MotionWrapper
              animate={{ scale: fillType === 'full' ? 1.2 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Star
                size={size}
                color={fillType === 'full' ? '#fbbf24' : '#fcd166ff'}
                fill={fillType === 'full' ? '#fbbf24' : 'transparent'}
              />
            </MotionWrapper>
          </Pressable>
        )
      })}
    </XStack>
  )
}

export default GetRating
