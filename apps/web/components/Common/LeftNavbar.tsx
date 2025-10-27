'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Blend, Home, LogOut, Search, User } from '@tamagui/lucide-icons'
import { Button, Separator, Spinner, View, YStack } from '@revit/ui'
import CreateForumDialog from '@/components/CreateForum'
import { useAuthStore } from '@revit/app/store'
import { useState } from 'react'

const navItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Search },
  { href: '/forums', label: 'Forums', icon: Blend },
  { href: '/profile', label: 'Profile', icon: User },
]

export default function LeftNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuthStore()
  const [logoutLoading, setLogoutLoading] = useState(false)

  const handleRouteClick = (pathname: string) => router.push(pathname)

  const handleLogout = async () => {
    setLogoutLoading(true)
    await signOut()
    setLogoutLoading(false)
    router.replace('/signin')
  }

  return (
    <YStack
      borderRightWidth={1}
      minHeight="100%"
      borderRightColor="$black4"
      pt="$8"
      pb="$12"
      px="$6"
      justifyContent="space-between"
    >
      <YStack gap="$6">
        <YStack gap="$4">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.includes(href)

            return (
              <Button key={href} onPress={() => handleRouteClick(href)} chromeless={!isActive}>
                <Button.Icon>
                  <Icon size={24} />
                </Button.Icon>
                <Button.Text>{label}</Button.Text>
              </Button>
            )
          })}
        </YStack>
        <Separator />
        <CreateForumDialog />
      </YStack>
      <View>
        <Button
          chromeless
          onPress={handleLogout}
          disabled={logoutLoading}
          iconAfter={logoutLoading ? <Spinner /> : null}
        >
          <Button.Icon>
            <LogOut color="$red10" size={24} />
          </Button.Icon>
          <Button.Text color="$red10">Logout</Button.Text>
        </Button>
      </View>
    </YStack>
  )
}
