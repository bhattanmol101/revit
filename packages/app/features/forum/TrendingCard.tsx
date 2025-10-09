'use client'

import { Users } from '@tamagui/lucide-icons'
import { Card, Separator, Text, View, XStack, YStack } from '@revit/ui'
import { useRouter } from 'solito/navigation'
import { TrendingForumT } from '@revit/shared/types/forum'

const TrendingForumCard = ({ forum }: { forum: TrendingForumT }) => {
  const router = useRouter()

  const handleForumClick = () => {
    router.push(`/forums/${forum.id}`)
  }

  return (
    <Card
      width="100%"
      my="$1"
      cursor="pointer"
      onPress={handleForumClick}
      hoverStyle={{ backgroundColor: '$black3' }}
    >
      <View px="$3.5" py="$2.5">
        <XStack justifyContent="space-between" alignItems="flex-start">
          <YStack flex={1} gap="$1">
            <Text fontSize="$2" fontWeight="bold">
              {forum.name}
            </Text>
            <Text fontSize="$2" color="$white8">
              {forum.description}
            </Text>
          </YStack>
          <View backgroundColor="$blue10" borderRadius={10} py="$1" px="$2">
            <Text fontSize="$1" fontWeight={600}>
              {forum.category}
            </Text>
          </View>
        </XStack>
        <Separator my="$2" />
        <XStack justifyContent="space-between" alignItems="center">
          <XStack alignItems="center" gap="$1">
            <Users size={14} color="#9ca3af" />
            <Text color="$black11" fontSize="$1">
              {forum.memberCount} participants • {forum.postCount} posts
            </Text>
          </XStack>

          <XStack justifyContent="space-between" alignItems="center">
            <Text color="$black11" fontSize="$1" fontWeight="bold">
              by {forum.createdBy}
            </Text>
          </XStack>
        </XStack>
      </View>
    </Card>
  )
}

export default TrendingForumCard
