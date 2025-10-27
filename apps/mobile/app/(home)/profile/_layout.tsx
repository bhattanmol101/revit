import { Stack } from 'expo-router'
import { screenOptions } from '../../../components/headers'

export default function ProfileLayout() {
  return (
    <Stack screenOptions={screenOptions()}>
      <Stack.Screen name="index" options={{ title: 'Profile' }} />
      <Stack.Screen name="edit" options={{ title: 'Edit Profile' }} />
    </Stack>
  )
}
