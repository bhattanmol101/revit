'use client'

import LeftNav from '@/components/Common/LeftNavbar'
import RightNav from '@/components/Common/RightNavbar'
import { View, XStack, YStack } from '@revit/ui'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <XStack flex={1} justifyContent="center" alignItems="flex-start" gap="$4">
      <View width="20%" height="100%">
        <View
          style={{
            flex: 1,
            position: 'fixed',
            width: '20%',
            height: '100%',
          }}
        >
          <YStack flex={1} justifyContent="flex-end">
            <LeftNav />
          </YStack>
        </View>
      </View>
      <YStack width="32%" py="$2">
        {children}
      </YStack>
      <View width="30%" height="100%">
        <YStack
          style={{
            position: 'fixed',
            width: '30%',
            height: '100%',
          }}
        >
          <YStack flex={1} justifyContent="flex-start">
            <RightNav />
          </YStack>
        </YStack>
      </View>
    </XStack>
  )
}
