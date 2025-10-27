import { Stack } from 'expo-router'
import { screenOptions } from '../../../components/headers'

export default function ForumsLayout() {
  return (
    <Stack screenOptions={screenOptions()}>
      <Stack.Screen name="index" options={{ title: 'Forums' }} />
      <Stack.Screen name="create" options={{ title: 'Create Forum' }} />
    </Stack>
  )
}
