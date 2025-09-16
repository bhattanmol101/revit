'use client'

import { useLink, useRouter } from 'solito/navigation'
import {
  Button,
  Text,
  YStack,
  InputField,
  Theme,
  AnimatePresence,
  Spinner,
  View,
  Separator,
  Paragraph,
  SizableText,
  H1,
} from '@revit/ui'
import { useState } from 'react'
import Revit from '../icons/Revit'
import Google from '../icons/Google'
import { UserSigninT } from '../../types/user'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SigninFormType, signinSchema } from '../../validators/UserSchema'
import { KeyboardAvoidingView, Platform } from 'react-native'

interface SigninProps {
  // handleGoogleSignin: () => void
  handleSignin: ({ email, password }: UserSigninT) => Promise<any>
}

function useSignIn() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  return {
    status: status,
    signIn: () => {
      setStatus('loading')
      setTimeout(() => {
        setStatus('success')
      }, 2000)
    },
  }
}

export default function Signin({ handleSignin }: SigninProps) {
  const { signIn, status } = useSignIn()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormType>({
    resolver: zodResolver(signinSchema),
  })

  const onSubmit: SubmitHandler<SigninFormType> = (data: SigninFormType) => {
    console.log(data)
    signIn()
    handleSignin(data as UserSigninT)
  }

  const linkProps = useLink({
    href: '/signup',
  })

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <YStack width="100%" gap="$3">
        <YStack gap="$6" paddingBottom="$5" alignItems="center" justifyContent="center">
          <Revit height={90} width={90} />
          <H1 fontSize="$6">Welcome back to Revit!</H1>
        </YStack>
        <YStack gap="$3">
          <Text fontSize="$4" alignSelf="center">
            Sign in to your account
          </Text>
          <Controller
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <InputField
                id="email"
                label="E-mail"
                placeholder="john.doe@aeradron.com"
                onChangeText={onChange}
                value={value}
                error={error ? error.message : ''}
              />
            )}
            name="email"
          />
          <Controller
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <InputField
                id="password"
                label="Password"
                textContentType="password"
                secureTextEntry
                placeholder="Sample@123"
                onChangeText={onChange}
                value={value}
                error={error ? error.message : ''}
              />
            )}
            name="password"
          />
        </YStack>
        <ForgotPasswordLink />
        <Theme inverse>
          <Button
            mt="$4"
            mb="$2"
            disabled={status === 'loading'}
            onPress={handleSubmit(onSubmit)}
            minWidth="100%"
            iconAfter={
              <AnimatePresence>
                {status === 'loading' && (
                  <Spinner
                    color="$color"
                    key="loading-spinner"
                    opacity={1}
                    scale={1}
                    animation="quick"
                    enterStyle={{
                      opacity: 0,
                      scale: 0.5,
                    }}
                    exitStyle={{
                      opacity: 0,
                      scale: 0.5,
                    }}
                  />
                )}
              </AnimatePresence>
            }
          >
            <Button.Text>Sign In</Button.Text>
          </Button>
        </Theme>
        <View flexDirection="column" gap="$3" width="100%" alignItems="center">
          <Theme>
            <View
              flexDirection="column"
              gap="$3"
              width="100%"
              alignSelf="center"
              alignItems="center"
            >
              <View flexDirection="row" width="100%" alignItems="center" gap="$4">
                <Separator />
                <Paragraph>OR</Paragraph>
                <Separator />
              </View>
              <Button minWidth="100%">
                <Button.Icon>
                  <Google height={20} width={20} />
                </Button.Icon>
                <Button.Text>Continue with Google</Button.Text>
              </Button>
            </View>
          </Theme>
        </View>
        <SignUpLink />
      </YStack>
    </KeyboardAvoidingView>
  )
}

// Swap for your own Link
const Link = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <View href={href} tag="a">
      {children}
    </View>
  )
}

const SignUpLink = () => {
  const router = useRouter()
  return (
    <Paragraph
      size="$1"
      textDecorationStyle="unset"
      ta="center"
      onPress={() => router.push('/signup')}
      cursor="pointer"
    >
      Don&apos;t have an account?{' '}
      <SizableText
        color="$blue11"
        hoverStyle={{
          color: '$colorHover',
        }}
        textDecorationLine="underline"
      >
        Sign up
      </SizableText>
    </Paragraph>
  )
}

const ForgotPasswordLink = () => {
  const router = useRouter()
  return (
    <Paragraph
      color="$gray11"
      hoverStyle={{
        color: '$gray12',
      }}
      alignSelf="flex-end"
      size="$1"
      marginTop="$1"
      onPress={() => router.push('/forgot-password')}
      cursor="pointer"
    >
      Forgot your password?
    </Paragraph>
  )
}
