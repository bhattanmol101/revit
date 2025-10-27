import { Stack } from 'expo-router'
import { screenOptions } from '../../../components/headers'

export default function PostLayout() {
  return (
    <Stack screenOptions={screenOptions()}>
      <Stack.Screen name="create" options={{ title: 'Create Post' }} />
    </Stack>
  )
}
