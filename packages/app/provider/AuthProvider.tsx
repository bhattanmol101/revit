'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter, usePathname } from 'solito/navigation'
import { useAuthStore } from '@revit/api/store/auth.store'
import { trpc } from '@revit/api/client'
import {PUBLIC_ROUTES} from "@revit/app/utils/constants";
// import { usePathname } from 'next/navigation'
import {Loader} from "@revit/ui";

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const accessToken = useAuthStore((s) => s.accessToken)
  const isHydrated = useAuthStore((s) => s.isHydrated)
  const setSession = useAuthStore((s) => s.setSession)
  const clearSession = useAuthStore((s) => s.clearSession)

  const shouldValidate = isHydrated && Boolean(accessToken)

  const meQuery = trpc.auth.get.useQuery(undefined, {
    enabled: shouldValidate,
    retry: false,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  })


  useEffect(() => {
    if (!isHydrated) return

    if (!accessToken) {
      clearSession()
      return
    }

    if (meQuery.status === 'success') {
      if (meQuery.data) {
        setSession({
          user: meQuery.data,
          accessToken,
        })
      } else {
        clearSession()
      }
    }

    if (meQuery.status === 'error') {
      clearSession()
    }
  }, [
    isHydrated,
    accessToken,
    meQuery.status,
    meQuery.data,
    setSession,
    clearSession,
  ])


  useEffect(() => {
    if (!isHydrated) return
    if (accessToken && meQuery.isLoading) return

    const isPublicRoute = PUBLIC_ROUTES.has(pathname!!)
    const isAuthenticated = Boolean(accessToken && meQuery.data)

    if (isAuthenticated && isPublicRoute) {
      router.replace('/home')
      return
    }

    if (!isAuthenticated && !isPublicRoute) {
      router.replace('/')
    }
  }, [
    isHydrated,
    accessToken,
    meQuery.isLoading,
    meQuery.data,
    pathname,
    router,
  ])

  if (!isHydrated || (accessToken && meQuery.isLoading)) {
    return <Loader size="large" />
  }

  return <>{children}</>
}