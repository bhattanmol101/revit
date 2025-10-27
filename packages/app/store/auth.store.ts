import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { fetchLoggedInUser, signOutApi } from '@revit/api/auth/user'
import { signInApi, signInWithGoogleApi, signUpApi } from '@revit/api/auth'
import { SigninT, SignupT, UserT } from '@revit/shared/types/user'
import { storage } from '@revit/shared/storage'
import { Platform } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'

type AuthState = {
  user: UserT | null
  loading: boolean
  error: string | null
  signIn: ({ email, password }: SigninT) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signUp: (signup: SignupT) => Promise<Error | undefined>
  signOut: () => Promise<void>
  fetchUser: () => Promise<void>
}

WebBrowser.maybeCompleteAuthSession()

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,
      signIn: async ({ email, password }: SigninT) => {
        set({ loading: true })
        const error = await signInApi({ email, password })
        if (error) {
          console.error(error)
          set({ loading: false, error: error.message })
          return
        }
        const { user, error: userError } = await fetchLoggedInUser()
        set({ loading: false })
        if (userError) {
          console.error(userError)
          set({ error: userError.message })
          return
        }
        set({ user: user })
      },
      signInWithGoogle: async () => {
        try {
          if (Platform.OS === 'web') {
            const { uri, error } = await signInWithGoogleApi()
            console.log('uri', uri)
            if (error) {
              set({ error: error.message })
            }
          } else {
            // 📱 Mobile Expo flow
            const redirectUri = AuthSession.makeRedirectUri({
              scheme: 'revit-app', // 👈 must match "scheme" in app.json
              path: 'auth/callback',
            })

            console.log('Redirect URI:', redirectUri)

            const { uri, error } = await signInWithGoogleApi(redirectUri)
            if (error) {
              set({ error: error.message })
              return
            }

            if (uri) {
              const res = await WebBrowser.openAuthSessionAsync(uri, redirectUri)
              console.log('res', res)
              if (res.type !== 'success') {
                set({ error: 'Authentication failed' })
                return
              }
            }
          }

          const { user, error: userError } = await fetchLoggedInUser()
          console.log('user', user)
          if (userError) {
            set({ error: userError.message })
            return
          }
          set({ user: user })
        } catch (err: any) {
          console.error('Google Sign-In Error:', err)
          set({ error: err.message })
        }
      },
      signUp: async (signup: SignupT) => {
        set({ loading: true })
        const error = await signUpApi({
          email: signup.email,
          password: signup.password,
          check: true,
          name: signup.name,
        })
        set({ loading: false })
        if (error) {
          console.error(error)
          set({ error: error.message })
          return error
        }
      },
      signOut: async () => {
        await signOutApi()
      },
      fetchUser: async () => {
        set({ loading: true })
        const { user, error } = await fetchLoggedInUser()
        set({ loading: false })
        if (error) {
          set({ user: null, error: error.message })
          return
        }
        set({ user: user, loading: false })
      },
    }),
    { name: 'auth-store', storage }
  )
)
