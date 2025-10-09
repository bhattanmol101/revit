import { Star, StarHalf } from '@tamagui/lucide-icons'
import { GetThemeValueForKey, Text, XStack } from '@revit/ui'

const Rating = ({
  rating,
  size = 24,
  showRating = true,
  fontSize = '$3',
}: {
  rating: number
  size?: number
  showRating?: boolean
  fontSize?: GetThemeValueForKey<'fontSize'> | number
}) => {
  const totalStars = 5
  const hasHalfStar = rating % 1 >= 0.5
  return (
    <XStack gap="$0.5" alignItems="center">
      {[...Array(totalStars)].map((_, index) => {
        const currentRating = index + 1
        return currentRating < rating ? (
          <Star key={currentRating} size={size} color="#fbbf24" fill="#fbbf24" />
        ) : currentRating === totalStars && hasHalfStar ? (
          <StarHalf key={currentRating} size={size} color="#fbbf24" fill="#fbbf24" />
        ) : (
          <Star key={currentRating} size={size} color="#fbbf24" />
        )
      })}
      {showRating && (
        <Text ml="$2" fontSize={fontSize}>
          {rating.toFixed(1)}
        </Text>
      )}
    </XStack>
  )
}

export default Rating
