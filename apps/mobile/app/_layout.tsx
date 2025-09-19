import { useEffect } from 'react'
import { DarkTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { Provider } from '@revit/app/provider'
import { NativeToast } from '@revit/ui/src/NativeToast'
import ContextProvider from '../components/Provider/ContextProvider'

export const unstable_settings = {
  // Ensure that reloading on `/user` keeps a back button present.
  initialRouteName: 'Home',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function App() {
  const [interLoaded, interError] = useFonts({
    'NotoSans-Regular': require('@revit/ui/fonts/NotoSans-Regular.ttf'),
    'NotoSans-Medium': require('@revit/ui/fonts/NotoSans-Medium.ttf'),
    'NotoSans-Light': require('@revit/ui/fonts/NotoSans-Light.ttf'),
    'NotoSans-SemiBold': require('@revit/ui/fonts/NotoSans-SemiBold.ttf'),
    'NotoSans-Bold': require('@revit/ui/fonts/NotoSans-Bold.ttf'),
    'NotoSans-ExtraBold': require('@revit/ui/fonts/NotoSans-ExtraBold.ttf'),
  })

  useEffect(() => {
    if (interLoaded || interError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync()
    }
  }, [interLoaded, interError])

  if (!interLoaded && !interError) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  return (
    <Provider>
      <ThemeProvider value={DarkTheme}>
        <ContextProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="(home)" />
          </Stack>
          <NativeToast />
        </ContextProvider>
      </ThemeProvider>
    </Provider>
  )
}
