'use client'

import { Text, View, XStack, YStack } from '@revit/ui'
import PostCard from '@revit/shared/components/post/Card'

function HomePage() {
  return (
    <XStack flex={1} justifyContent="center" alignItems="flex-start" gap="$4">
      <View width="20%">
        <View
          style={{
            flex: 1,
            position: 'fixed',
            top: 10,
            width: '20%',
          }}
        >
          <YStack flex={1} justifyContent="flex-end">
            <Text>1</Text>
          </YStack>
        </View>
      </View>
      <YStack width="33%">
        <PostCard />
      </YStack>
      <View width="30%">
        <YStack
          style={{
            position: 'fixed',
            top: 10,
            width: '30%',
          }}
        >
          <YStack flex={1} justifyContent="flex-start">
            <PostCard />
          </YStack>
        </YStack>
      </View>
    </XStack>
  )
}

export default HomePage
