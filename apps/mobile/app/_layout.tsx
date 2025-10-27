import { useEffect } from 'react'
import { DarkTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { Provider } from '@revit/app/provider'
import { NativeToast } from '@revit/ui/src/NativeToast'
import { AuthProvider } from '@revit/app/provider/auth/AuthProvider'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'

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
  const insets = useSafeAreaInsets()
  return (
    <Provider>
      <ThemeProvider value={DarkTheme}>
        <SafeAreaProvider
          style={{
            flex: 1,
            paddingBottom: insets.bottom,
            backgroundColor: 'black',
          }}
        >
          <AuthProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="signin" />
              <Stack.Screen name="signup" />
            </Stack>
          </AuthProvider>
        </SafeAreaProvider>
        <NativeToast />
      </ThemeProvider>
    </Provider>
  )
}
