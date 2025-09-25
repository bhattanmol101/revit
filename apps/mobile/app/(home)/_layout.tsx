import { useTheme, Button, View, Text, Dropdown, DropdownItem } from '@revit/ui'
import { DrawerActions } from '@react-navigation/native'
import { Home, Menu, Plus, Search, User } from '@tamagui/lucide-icons'
// import { IconGearFill, IconGear, IconHouse, IconHouseFill } from '@tamagui-icons/icon-ph'
import { router, Stack, Tabs, useNavigation, usePathname } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Revit from '@revit/app/features/icons/Revit'
import { useSession } from 'apps/mobile/components/Provider/ContextProvider'
import Avatar from '@revit/app/features/common/Avatar'
import { useState } from 'react'

export default function Layout() {
  const { user } = useSession()
  const insets = useSafeAreaInsets()
  const [open, setOpen] = useState(false)

  const onOpenChange = () => {
    setOpen(!open)
  }
  let items: DropdownItem[] = [
    {
      key: 'profile',
      label: 'Profile',
    },
  ]

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          paddingTop: 10,
          marginBottom: insets.bottom,
          height: 60,
          alignContent: 'center',
          justifyContent: 'center',
        },
        headerStyle: {
          height: 82,
        },
        headerTitle: () => (
          <Text marginLeft="$1" fontSize="$4" letterSpacing={0.5}>
            Revit
          </Text>
        ),
        headerLeft: () => (
          <View marginLeft="$3">
            <Revit width={36} height={36} />
          </View>
        ),
        headerRight: () => (
          <View marginRight="$3" onPress={onOpenChange}>
            <Dropdown
              items={items}
              open={open}
              onOpenChange={onOpenChange}
              align="right"
              label={<Avatar size="$3" image={user?.avatar} />}
            />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="home/index"
        key="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color, focused }) => (
            <Home color={focused ? '$color12' : '$color10'} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore/index"
        key="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color, focused }) => (
            <Search color={focused ? '$color12' : '$color10'} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="post/create"
        key="index"
        options={{
          title: 'Create Revit Post',
          tabBarIcon: ({ size, color, focused }) => (
            <Plus color={focused ? '$color12' : '$color10'} size={size} strokeWidth={2} />
          ),
        }}
      />

      <Tabs.Screen
        name="forums/index"
        key="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color, focused }) => (
            <Search color={focused ? '$color12' : '$color10'} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        key="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ size, color, focused }) => (
            <User color={focused ? '$color12' : '$color10'} size={size} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  )
}
