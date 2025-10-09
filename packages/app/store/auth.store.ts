import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { fetchLoggedInUser, signOutApi } from '@revit/api/auth/user'
import { signInApi } from '@revit/api/auth/signin'
import { UserT } from '@revit/shared/types/user'
import { storage } from '@revit/shared/storage'

type AuthState = {
  user: UserT | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      signIn: async (email, password) => {
        set({ loading: true })
        const error = await signInApi({ email, password })
        if (error) {
          console.error(error)
          set({ loading: false })
          return
        }
        const { user, error: userError } = await fetchLoggedInUser()
        set({ loading: false })
        if (userError) {
          console.error(userError)
          return
        }
        set({ user: user, loading: false })
      },
      signOut: async () => {
        await signOutApi()
        set({ user: null })
      },
      fetchUser: async () => {
        set({ loading: true })
        const { user, error } = await fetchLoggedInUser()
        set({ loading: false })
        if (error) {
          console.error(error)
          return
        }
        set({ user: user, loading: false })
      },
    }),
    { name: 'auth-store', storage }
  )
)
