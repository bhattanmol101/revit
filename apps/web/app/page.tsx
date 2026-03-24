'use client'

import { HomeScreen } from '@revit/app/features/home/screen'
import { useRouter } from 'next/navigation'
import { trpc } from '@revit/app/trpc/client'
import { useEffect } from 'react'

export default function Page() {
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
  return <HomeScreen onLinkPress={() => router.push('/user/nate')} />
}
