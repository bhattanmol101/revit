'use client'

import { YStack } from '@revit/ui'
import { usePathname } from 'next/navigation'
import CreatePostButton from '../CreatePostButton'
import TrendingForums from '../TrendingForums'

export default function RightNav() {
  const pathname = usePathname()

  return (
    <YStack
      borderLeftWidth={1}
      minHeight="100%"
      borderLeftColor="$black4"
      pt="$8"
      pb="$12"
      px="$6"
      justifyContent="space-between"
    >
      {pathname === '/home' ? (
        <CreatePostButton />
      ) : pathname.includes('/forums') ? (
        <TrendingForums />
      ) : null}
    </YStack>
  )
}
