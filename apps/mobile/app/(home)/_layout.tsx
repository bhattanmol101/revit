import { useTheme, Button } from '@revit/ui'
import { DrawerActions } from '@react-navigation/native'
import { Home, Menu, Plus, Search, User } from '@tamagui/lucide-icons'
// import { IconGearFill, IconGear, IconHouse, IconHouseFill } from '@tamagui-icons/icon-ph'
import { router, Stack, Tabs, useNavigation, usePathname } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Layout() {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()

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
