'use client'

import { Users } from '@tamagui/lucide-icons'
import { Card, Image, Text, View, XStack, YStack } from '@revit/ui'
import { useRouter } from 'solito/navigation'
import { ForumT } from '@revit/shared/types/forum'

const ForumCard = ({ forum }: { forum: ForumT }) => {
  const router = useRouter()

  const handleForumClick = () => {
    router.push(`/forums/${forum.id}`)
  }

  const membershipCount = forum.members.length > 0 ? forum.members[0].membershipCount : 0
  const postCount = forum.posts.length > 0 ? forum.posts[0].postCount : 0

  return (
    <Card
      width="100%"
      my="$1"
      cursor="pointer"
      onPress={handleForumClick}
      hoverStyle={{ backgroundColor: '$black3' }}
    >
      <Card.Header
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingBottom="$1"
      >
        <Image source={{ uri: forum.image }} width="100%" height={200} alt="forum image" />
      </Card.Header>
      <YStack p="$3" gap="$3">
        <XStack justifyContent="space-between" alignItems="flex-start">
          <YStack flex={1} gap="$1">
            <Text fontSize="$3" fontWeight="bold">
              {forum.name}
            </Text>
            <Text fontSize="$2" color="$white8">
              {forum.description}
            </Text>
          </YStack>
          <View backgroundColor="$blue10" borderRadius={10} py="$1" px="$2">
            <Text fontSize="$1" fontWeight={600}>
              {/* {forum.category} */}
            </Text>
          </View>
        </XStack>

        <XStack alignItems="center">
          <Users size={16} color="#9ca3af" />
          <Text color="$black11" fontSize="$2">
            {membershipCount} participants • {postCount} posts
          </Text>
        </XStack>

        <XStack justifyContent="space-between" alignItems="center">
          {/* <XStack>
            <Rating rating={forum.rating} size={16} fontSize="$2" />
          </XStack> */}
          <Text color="$black11" fontSize="$2" fontWeight="bold">
            by {forum.creator.name}
          </Text>
        </XStack>
      </YStack>
    </Card>
  )
}

export default ForumCard
