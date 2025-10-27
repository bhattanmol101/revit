import { Stack } from 'expo-router'
import { screenOptions } from '../../../../components/headers'

export default function ForumLayout() {
  return (
    <Stack screenOptions={screenOptions()}>
      <Stack.Screen name="index" options={{ title: 'Revit Forum' }} />
    </Stack>
  )
}
