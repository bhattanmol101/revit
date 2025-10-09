'use client'

import { Paragraph, Text, XStack, YStack } from '@revit/ui'
import CreatePostDialog from '../CreatePost'
import { useSession } from '../Provider/ContextProvider'
import Avatar from '@revit/app/features/common/Avatar'
import { usePathname } from 'next/navigation'
import CreatePostButton from '../CreatePostButton'
import TrendingForums from '../TrendingForums'

export default function RightNav() {
  const pathname = usePathname()

  const { user } = useSession()

  if (!user) {
    return
  }

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
        <CreatePostButton user={user} />
      ) : pathname.includes('/forums') ? (
        <TrendingForums />
      ) : null}
    </YStack>
  )
}
