import { Blend, Home, Plus, Search, User } from '@tamagui/lucide-icons'
import { Tabs } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Layout() {
  const insets = useSafeAreaInsets()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          paddingTop: 10,
          height: 60,
          alignContent: 'center',
          justifyContent: 'center',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        key="home"
        options={{
          title: 'Revit',
          tabBarIcon: ({ size, color, focused }) => (
            <Home color={focused ? '$color12' : '$color10'} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        key="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ size, color, focused }) => (
            <Search color={focused ? '$color12' : '$color10'} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="post"
        key="post"
        options={{
          title: 'Create Post',
          tabBarIcon: ({ size, color, focused }) => (
            <Plus color={focused ? '$color12' : '$color10'} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="forums"
        key="forum"
        options={{
          title: 'Forums',
          tabBarIcon: ({ size, color, focused }) => (
            <Blend color={focused ? '$color12' : '$color10'} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
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
