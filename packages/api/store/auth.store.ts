import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {zustandStorage} from "./storage";

type AuthUser = {
    id: string
    email: string | null
}

type AuthState = {
    user: AuthUser | null
    accessToken: string | null
    isHydrated: boolean
    setSession: (data: { user: { id: string; email?: string | null } | null; accessToken: string }) => void
    clearSession: () => void
    setHydrated: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            isHydrated: false,

            setSession: ({ user, accessToken }) =>
                 set({
                     user: user
                         ? {
                             id: user.id,
                             email: user.email ?? null,
                         }
                         : null,
                     accessToken,
                 }),

            clearSession: () =>
                set({ user: null, accessToken: null }),

            setHydrated: () => set((state) => ({...state, isHydrated: true })),
        }),
        {
            name: 'auth-storage',
            storage: zustandStorage,
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
            }),
            onRehydrateStorage: () => (state) => { state?.setHydrated() }}
    )
)
