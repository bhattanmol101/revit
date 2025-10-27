import { Stack } from 'expo-router'
import { screenOptions } from '../../../components/headers'

export default function ExploreLayout() {
  return (
    <Stack screenOptions={screenOptions()}>
      <Stack.Screen name="index" options={{ title: 'Explore' }} />
    </Stack>
  )
}
