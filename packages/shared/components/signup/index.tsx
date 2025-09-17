'use client'

import { useRouter } from 'solito/navigation'
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
  CheckboxWithLabel,
  ScrollView,
  useToastController,
} from '@revit/ui'
import { useState } from 'react'
import Revit from '../icons/Revit'
import Google from '../icons/Google'
import { UserSignupT } from '../../types/user'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignupFormType, signupSchema } from '../../validators/UserSchema'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { CheckCircle } from '@tamagui/lucide-icons'

interface SignupProps {
  // handleGoogleSignin: () => void
  handleSignup: ({ name, email, password }: UserSignupT) => Promise<any>
}

export default function Signup({ handleSignup }: SignupProps) {
  const toast = useToastController()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  const { control, handleSubmit } = useForm<SignupFormType>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit: SubmitHandler<SignupFormType> = async (data: SignupFormType) => {
    setStatus('loading')
    const error = await handleSignup(data as UserSignupT)
    setStatus('idle')
    if (!error) {
      setStatus('success')
    } else {
      toast.show('Invalid Credentials!', {
        message: 'Please provide correct details.',
        customData: { type: 'error' },
      })
    }
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

  if (status === 'success') {
    return <ConfirmEmail />
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
      <ScrollView width="100%" px="$1">
        <YStack width="100%" gap="$3">
          <YStack gap="$6" paddingBottom="$5" alignItems="center" justifyContent="center">
            <Revit height={90} width={90} />
            <H1 fontSize="$6">Welcome to Revit!</H1>
          </YStack>
          <YStack gap="$3">
            <Text fontSize="$4" alignSelf="center">
              Create your revit account
            </Text>
            <Controller
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <InputField
                  id="signup_name"
                  label="Name"
                  placeholder="John Doe"
                  onChangeText={onChange}
                  value={value}
                  error={error ? error.message : ''}
                />
              )}
              name="name"
            />
            <Controller
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <InputField
                  id="signup_email"
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
                  id="signup_password"
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
            <Controller
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <CheckboxWithLabel
                  size="$3"
                  fontSize="$2"
                  borderColor={error ? '$red10' : 'unset'}
                  label="Agree to our terms & conditions"
                  onCheckedChange={onChange}
                  checked={value}
                />
              )}
              name="check"
            />
          </YStack>
          <Theme inverse>
            <Button
              mt="$4"
              mb="$2"
              disabled={status === 'loading'}
              onPress={handleSubmit(onSubmit)}
              minWidth="100%"
              iconAfter={
                <AnimatePresence>
                  {status === 'loading' ? (
                    <Spinner
                      color="$color"
                      key="signin-loading-spinner"
                      opacity={1}
                      scale={1}
                      animation="quick"
                      enterStyle={{
                        opacity: 0,
                        scale: 0.5,
                      }}
                    />
                  ) : null}
                </AnimatePresence>
              }
            >
              <Button.Text>Signup</Button.Text>
            </Button>
          </Theme>
          <View flexDirection="column" gap="$3" minWidth="100%" alignItems="center">
            <Theme>
              <View
                flexDirection="column"
                gap="$3"
                alignSelf="center"
                alignItems="center"
                minWidth="100%"
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
                  <Button.Text fontWeight={300}>Continue with Google</Button.Text>
                </Button>
              </View>
            </Theme>
          </View>
          <SignUpLink />
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const SignUpLink = () => {
  const router = useRouter()
  return (
    <Paragraph
      size="$1"
      textDecorationStyle="unset"
      ta="center"
      onPress={() => router.push('/')}
      cursor="pointer"
    >
      Already have an account?{' '}
      <SizableText
        hoverStyle={{
          color: '$colorHover',
        }}
        color="$blue11"
        textDecorationLine="underline"
      >
        Sign in
      </SizableText>
    </Paragraph>
  )
}

const ConfirmEmail = () => {
  return (
    <YStack justifyContent="center" alignItems="center" gap="$3">
      <H1>Check Your Email!</H1>
      <Paragraph textAlign="center">
        We&apos;ve sent you a confirmation link. Please check your email and confirm it.
      </Paragraph>
    </YStack>
  )
}
