import { HomeScreen } from '@revit/app/features/home/screen'
import { Stack, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { trpc } from '@revit/app/trpc/client'

export default function Screen() {
  const router = useRouter()

  useEffect(() => {
    // Example: Fetch current user profile on component mount
    const fetchProfile = async () => {
      try {
        const data = await trpc.profile.me.query()
        console.log('User Email:', data.email)
        console.log('Username:', data.profile?.username)
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }

    fetchProfile()
  }, [])

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Home',
        }}
      />
      <HomeScreen onLinkPress={() => router.push('/user/nate')} />
    </>
  )
}
