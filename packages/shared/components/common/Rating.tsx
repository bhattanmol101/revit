import { Star } from '@tamagui/lucide-icons'
import { Text, XStack } from '@revit/ui'

const StarRating = ({ rating }: { rating: number }) => {
  const totalStars = 5
  const hasHalfStar = rating % 1 >= 0.5
  return (
    <XStack gap="$1">
      {[...Array(totalStars)].map((_, index) => {
        const currentRating = index + 1
        return currentRating < totalStars ? (
          <Star key={currentRating} size={22} color="#fbbf24" fill="#fbbf24" />
        ) : currentRating === totalStars && hasHalfStar ? (
          <Star key={currentRating} size={22} color="#fbbf24" fill="#fbbf24" />
        ) : (
          <Star key={currentRating} size={22} color="#fbbf24" />
        )
      })}
      <Text fontWeight="$3" ml="$2">
        {rating.toFixed(1)}
      </Text>
    </XStack>
  )
}

export default StarRating
