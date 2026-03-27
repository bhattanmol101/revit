'use client'

import { useState } from 'react'
import {useRouter} from "solito/navigation";
import { Button, Input, YStack } from 'tamagui'
import {trpc} from "@revit/api/client";
import { useAuthStore } from '@revit/api/store/auth.store'

export default function SignInScreen() {
  const router = useRouter()
    const mutation = trpc.auth.signIn.useMutation()
  const setSession = useAuthStore((s) => s.setSession)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
      mutation.mutate({email, password}, {
          onSuccess: (data) => {
              if (!data.accessToken) {
                  return
              }

              setSession({
                  user: data.user,
                  accessToken: data.accessToken,
              })
              router.replace('/')
          },
          onError: (error) => {console.log(error)}
      })
  }

  return (
      <YStack gap="$3" p="$4">
        <Input placeholder="Email" onChangeText={setEmail} />
        <Input placeholder="Password" secureTextEntry onChangeText={setPassword} />
        <Button onPress={handleLogin} disabled={mutation.isPending}>Login</Button>
      </YStack>
  )
}
