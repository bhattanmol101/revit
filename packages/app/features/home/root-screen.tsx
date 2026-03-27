'use client'

import {useEffect} from 'react'
import { Text, YStack } from '@revit/ui'
import { useAuthStore } from '@revit/api/store/auth.store'
import {useRouter} from "solito/navigation"

export function RootScreen() {
    const user = useAuthStore((s) => s.user)
    const isHydrated = useAuthStore((s) => s.isHydrated)
    const router = useRouter()

    useEffect(() => {
        if (isHydrated && !user) {
            router.replace('/signin')
        }
    }, [isHydrated, user, router])

    if (!isHydrated) {
        return (
            <YStack flex={1} alignItems="center" justifyContent="center">
                <Text>Loading...</Text>
            </YStack>
        )
    }

    if (!user) {
        return null
    }

    return ( <YStack flex={1} alignItems="center" justifyContent="center"><Text>Welcome to revit</Text></YStack> )
}
