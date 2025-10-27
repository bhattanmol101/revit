import { Stack } from 'expo-router'
import { screenOptions } from '../../../../components/headers'

export default function UserProfileLayout() {
  return (
    <Stack screenOptions={screenOptions()}>
      <Stack.Screen name="index" options={{ title: 'User Profile' }} />
    </Stack>
  )
}
