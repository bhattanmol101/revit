import { useEffect, useState } from 'react'
import { DarkTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Slot, SplashScreen, Stack, useRouter } from 'expo-router'
import { Provider } from '@revit/app/provider'
import { NativeToast } from '@revit/ui/src/NativeToast'
import ContextProvider, { useSession } from '../components/Provider/ContextProvider'
import { Spinner, View } from '@revit/ui'

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

const InitialLayout = () => {
  const router = useRouter()
  const { user, initialized } = useSession()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (initialized) {
      setLoading(false)
      if (user) {
        console.log('log')
        router.replace('/home')
      } else {
        router.replace('/')
      }
    }
  }, [initialized])

  if (loading) {
    return (
      <View flex={1} alignItems="center" justifyContent="center">
        <Spinner size="large" />
      </View>
    )
  }

  return
}

function RootLayoutNav() {
  return (
    <Provider>
      <ThemeProvider value={DarkTheme}>
        <ContextProvider>
          <InitialLayout />
          <Slot />
          <NativeToast />
        </ContextProvider>
      </ThemeProvider>
    </Provider>
  )
}
