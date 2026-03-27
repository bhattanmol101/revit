import { RootScreen } from '@revit/app/features/home/root-screen'
import { Stack, useRouter } from 'expo-router'

export default function Screen() {
    return (
    <>
      <Stack.Screen
        options={{
          title: 'Home',
        }}
      />
      <RootScreen />
    </>
  )
}
