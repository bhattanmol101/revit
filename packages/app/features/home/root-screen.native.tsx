import { Text, YStack } from '@revit/ui'
import { useAuthStore } from '@revit/api/store/auth.store'
import { Redirect } from 'expo-router'

export function RootScreen() {
    const user = useAuthStore((s) => s.user)
    const isHydrated = useAuthStore((s) => s.isHydrated)

    if (!isHydrated) {
        return (
            <YStack flex={1} alignItems="center" justifyContent="center">
                <Text>Loading...</Text>
            </YStack>
        )
    }

    if (!user) {
        return <Redirect href="/signin" />
    }

    return ( <YStack flex={1} alignItems="center" justifyContent="center"><Text>Welcome to revit</Text></YStack> )
}
