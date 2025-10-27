import { DropdownItem, ListItem, Sheet, Text, View, YGroup } from '@revit/ui'
import { LogOut, Settings } from '@tamagui/lucide-icons'
import Revit from '@revit/app/features/icons/Revit'
import Avatar from '@revit/app/features/common/Avatar'
import { useAuthStore } from '@revit/app/store'
import { useState } from 'react'
import { Pressable } from 'react-native'
import { useRouter } from 'expo-router'

export const screenOptions = () => {
  const router = useRouter()

  const { user, signOut } = useAuthStore()

  if (!user) {
    return {}
  }

  const [open, setOpen] = useState(false)
  const onOpenChange = () => {
    setOpen(!open)
  }

  const handleLogout = async () => {
    await signOut()
    setOpen(false)
    router.replace('/signin')
  }

  let items: DropdownItem[] = [
    {
      key: 'profile',
      label: 'Profile',
    },
  ]
  return {
    headerShown: true,
    headerTitle: ({ children }) => (
      <Text marginLeft="$2" fontSize="$4" letterSpacing={0.5}>
        {children}
      </Text>
    ),
    headerLeft: () => <Revit width={36} height={36} />,
    headerRight: () => (
      <View>
        <Pressable onPress={onOpenChange}>
          <Avatar size="$3" image={user?.avatar} />
        </Pressable>
        <Sheet
          forceRemoveScrollEnabled={open}
          modal={true}
          open={open}
          onOpenChange={setOpen}
          snapPoints={[500, 1090]}
          snapPointsMode="constant"
          dismissOnSnapToBottom
          position={0}
          zIndex={100_000}
          animation="medium"
        >
          <Sheet.Overlay
            animation="lazy"
            backgroundColor="$black6"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />

          <Sheet.Handle />
          <Sheet.Frame padding="$4" justifyContent="center" alignItems="center" gap="$5">
            <YGroup alignSelf="center" bordered width={300} size="$4">
              <YGroup.Item>
                <ListItem hoverTheme icon={Settings}>
                  Settings
                </ListItem>
              </YGroup.Item>
              <YGroup.Item>
                <ListItem color="$red10" hoverTheme icon={LogOut} onPress={handleLogout}>
                  Logout
                </ListItem>
              </YGroup.Item>
            </YGroup>
          </Sheet.Frame>
        </Sheet>
      </View>
    ),
  }
}
