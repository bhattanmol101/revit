import { useRouter } from 'expo-router'
import RevitLogo from '@revit/app/assets/logo/revit.svg'
import { Avatar, Button, XStack } from '@revit/ui'

export default function Header() {
  const router = useRouter()

  return (
    <XStack paddingHorizontal="$4" justify="space-between" items="center" paddingBottom="$2">
      <RevitLogo height={60} width={60} />
      <Button chromeless onPress={() => router.push('/home/profile')}>
        <Avatar size="$5">
          <Avatar.Fallback />
          <Avatar.Image
            source={{
              uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
            }}
          />
        </Avatar>
      </Button>
    </XStack>
  )
}
