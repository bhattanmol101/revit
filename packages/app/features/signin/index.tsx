'use client'

import { useRouter } from 'solito/navigation'
import {
  AnimatePresence,
  Button,
  H1,
  InputField,
  isWeb,
  Paragraph,
  Separator,
  SizableText,
  Spinner,
  Text,
  Theme,
  useToastController,
  View,
  YStack,
} from '@revit/ui'
import Revit from '../icons/Revit'
import Google from '../icons/Google'
import { signinSchema, SigninT } from '@revit/shared/types/user'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { useAuthStore } from '../../store'
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'

export default function Signin() {
  const router = useRouter()
  const toast = useToastController()

  const { loading, error, signIn, signInWithGoogle } = useAuthStore()

  const { control, handleSubmit } = useForm<SigninT>({
    resolver: zodResolver(signinSchema),
  })

  //Test User: locoj23912@insfou.com

  const signInWithGoogleWeb = async () => {
    await signInWithGoogle(null)
  }

  const signInWithGoogleMobile = async () => {
    try {
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        offlineAccess: true,
        forceCodeForRefreshToken: true,
      })
      await GoogleSignin.hasPlayServices()
      const response = await GoogleSignin.signIn()
      console.log(response)
      if (response && response.type === 'success' && response.data) {
        await signInWithGoogle(response.data.idToken)
      } else {
        // sign in was cancelled by user
        console.log('cancelled')
      }
    } catch (error) {
      console.log(error)
      if (error.code) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    }
  }

  const handleGoogleSignin = async () => {
    isWeb ? await signInWithGoogleWeb() : await signInWithGoogleMobile()
  }

  const onSubmit: SubmitHandler<SigninT> = async (data: SigninT) => {
    await signIn(data as SigninT)
    if (!error) {
      router.replace('/home')
    } else {
      toast.show('Invalid Credentials!', {
        message: 'Please provide correct details.',
        customData: { type: 'error' },
      })
    }
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
          <Text fontSize="$5" alignSelf="center" marginBottom="$5">
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
            disabled={loading}
            onPress={handleSubmit(onSubmit)}
            minWidth="100%"
            iconAfter={
              loading ? (
                <AnimatePresence>
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
                </AnimatePresence>
              ) : null
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
              <Button minWidth="100%" onPress={handleGoogleSignin}>
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

const SignUpLink = () => {
  const router = useRouter()
  return (
    <Paragraph
      size="$2"
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
        size="$2"
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
      size="$2"
      marginTop="$1"
      onPress={() => router.push('/forgot-password')}
      cursor="pointer"
    >
      Forgot your password?
    </Paragraph>
  )
}
