import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { fetchLoggedInUser, signOutApi } from '@revit/api/auth/user'
import { signInApi, signInWithGoogleApi, signUpApi } from '@revit/api/auth'
import { SigninT, SignupT, UserT } from '@revit/shared/types/user'
import { storage } from '@revit/shared/storage'

type AuthState = {
  user: UserT | null
  loading: boolean
  error: string | null
  signIn: ({ email, password }: SigninT) => Promise<void>
  signInWithGoogle: (token: string | null) => Promise<void>
  signUp: (signup: SignupT) => Promise<Error | undefined>
  signOut: () => Promise<void>
  fetchUser: () => Promise<void>
}

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
      signInWithGoogle: async (token: string | null) => {
        const error = await signInWithGoogleApi(token)
        if (error) {
          set({ error: error.message })
        }
        const { user, error: userError } = await fetchLoggedInUser()
        console.log('user', user)
        if (userError) {
          set({ error: userError.message })
          return
        }
        set({ user: user })
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
