'use client'

import { useLink, useRouter } from 'solito/navigation'
import { Button, Input, Text, XStack, YStack } from '@revit/ui'
import Revit from '../icons/Revit'
import Google from '../icons/Google'
import { useState } from 'react'
import { UserSigninT } from '@revit/shared/types/user'

interface SigninProps {
  // handleGoogleSignin: () => void
  handleSignin: ({ email, password }: UserSigninT) => Promise<any>
}
export default function Signin({ handleSignin }: SigninProps) {
  const router = useRouter()

  const linkProps = useLink({
    href: '/signup',
  })
  const [isInvalid, setIsInvalid] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = async () => {
    const error = await handleSignin({
      email: 'locoj23912@insfou.com',
      password: 'locoj23912@insfou.com',
    })
  }

  const handleGoogleSignin = async () => {
    console.log('here 1')
    // const { data, error } = await supabase.auth.signInWithOAuth({
    //   provider: 'google',
    //   options: {
    //     redirectTo: `https://localhost:8081/api/auth/callback`,
    //   },
    // })

    // console.log(data, error)
  }

  return (
    <YStack width="100%" gap="$3">
      <YStack gap="$6" paddingBottom="$5" items="center" justify="center">
        <Revit height={90} width={90} />
        <YStack items="center" justify="center" gap="$2">
          <Text fontSize="$8">
            Welcome to{' '}
            <Text fontWeight="bold" fontSize="$8">
              Revit!
            </Text>
          </Text>
          <Text fontSize="$5">Review Everything</Text>
        </YStack>
      </YStack>
      <YStack gap="$4">
        <YStack gap="$2">
          <Text>Email</Text>
          <Input
            placeholder="e.g. john.doe@aeradron.com"
            value={inputValue}
            onChangeText={(text) => setInputValue(text)}
          />
        </YStack>
        <YStack gap="$2">
          <Text>Password</Text>
          <Input
            placeholder="e.g. Sample@123"
            value={inputValue}
            onChangeText={(text) => setInputValue(text)}
          />
        </YStack>
        <Button onPress={handleSubmit} marginTop="$4">
          <Text>Login</Text>
        </Button>
      </YStack>
      <Text marginVertical="$2" fontSize="$1" self="center">
        -- OR --
      </Text>
      <Button variant="outlined" onPress={handleGoogleSignin}>
        <Text>Login with Google</Text>
        <Google height={20} width={20} />
      </Button>
      <XStack marginTop="$2" items="center" justify="center">
        <Text fontSize="$1">Dont have an account? </Text>
        <Button {...linkProps} chromeless>
          <Text fontSize="$1">Signup!</Text>
        </Button>
      </XStack>
    </YStack>
  )
}
