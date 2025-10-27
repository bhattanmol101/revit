'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'solito/navigation'
import { useAuthStore } from '../../store'
import { Spinner, View } from '@revit/ui'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, fetchUser } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  const [loading, setLoading] = useState(true)

  const fetchUserAndRedirect = async () => {
    await fetchUser()
    setLoading(false)
  }

  useEffect(() => {
    fetchUserAndRedirect()
  }, [])

  // Redirect logic (client-side)
  useEffect(() => {
    if (!loading) {
      const publicPaths = ['/signin', '/signup', '/']
      const isPublic = pathname === undefined || publicPaths.includes(pathname)
      if (user && isPublic) router.replace('/home')
      if (!user && !isPublic) {
        console.log('Redirecting to signin')
        router.replace('/signin')
      }
    }
  }, [loading, user])

  if (loading) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Spinner />
      </View>
    )
  }
  return <>{children}</>
}
