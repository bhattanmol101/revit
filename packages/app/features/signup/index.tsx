'use client'

import { useRouter } from 'solito/navigation'
import {
  AnimatePresence,
  Button,
  CheckboxWithLabel,
  H1,
  InputField,
  isWeb,
  Paragraph,
  ScrollView,
  Separator,
  SizableText,
  Spinner,
  Text,
  Theme,
  useToastController,
  View,
  YStack,
} from '@revit/ui'
import Google from '../icons/Google'
import { signupSchema, SignupT } from '@revit/shared/types/user'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '../../store'
import { useEffect, useState } from 'react'
import RevitText from '@revit/shared/assets/logo/RevitText'

export default function Signup() {
  const toast = useToastController()
  const [status, setStatus] = useState<'success' | 'error' | ''>('')

  const { loading, signUp } = useAuthStore()

  const { control, handleSubmit } = useForm<SignupT>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit: SubmitHandler<SignupT> = async (data: SignupT) => {
    const error = await signUp({
      email: data.email,
      check: true,
      password: data.password,
      name: data.name,
    })
    if (!error) {
      setStatus('success')
    } else {
      toast.show('Error occurred while singing up!', {
        message: 'Something went wrong. Please try again later.',
        customData: { type: 'error' },
      })
    }
  }

  useEffect(() => {
    return () => {
      setStatus('')
    }
  }, [])

  const handleGoogleSignin = async () => {
    console.log('here 1')
    // const { data, error } = await supabase.auth.signInWithOAuth({
    //   auth: 'google',
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
    <ScrollView width="100%" px="$1">
      <YStack width="100%" gap="$3" paddingBottom={isWeb ? 0 : 100}>
        <YStack gap="$6" paddingBottom="$5" alignItems="center" justifyContent="center">
          <RevitText height={90} width={90} />
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
            disabled={loading}
            onPress={handleSubmit(onSubmit)}
            minWidth="100%"
            iconAfter={
              <AnimatePresence>
                {loading ? (
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
  )
}

const SignUpLink = () => {
  const router = useRouter()
  return (
    <Paragraph
      size="$1"
      textDecorationStyle="unset"
      ta="center"
      onPress={() => router.push('/signin')}
      cursor="pointer"
    >
      Already have an account?{' '}
      <SizableText
        color="$blue11"
        hoverStyle={{
          color: '$colorHover',
        }}
        textDecorationLine="underline"
        size="$2"
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
