import { useEffect } from 'react'
import { Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { fetchLoggedInUser } from '@revit/api/auth/user'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleSession = async () => {
      const { user, error } = await fetchLoggedInUser()

      if (error) {
        router.replace('/signin')
        return
      }

      if (user) {
        // ✅ user logged in successfully
        router.replace('/home')
      } else {
        router.replace('/signin')
      }
    }

    handleSession()
  }, [])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Completing sign-in...</Text>
    </View>
  )
}
