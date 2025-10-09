'use client'

import { UserT } from '@revit/shared/types/user'
import { Spinner } from '@revit/ui'
import { createContext, useContext, useEffect, useState } from 'react'
import { fetchLoggedInUser } from '@revit/api/auth/user'
import { useAuthStore } from '@revit/app/store'

type MaybeUser = UserT | null

type UserContext = {
  user: MaybeUser
  setUser: (user: MaybeUser) => void
}

// @ts-ignore
const Context = createContext<UserContext>()

export default function ContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MaybeUser>(null)

  const { loading, fetchUser } = useAuthStore()

  useEffect(() => {
    fetchUser()
    const getUser = async () => {
      const { user, error } = await fetchLoggedInUser()
      if (error) {
        //TODO need to see what to do in this case
      }

      if (user) {
        setUser(user as UserT)
      }
    }

    getUser()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <Spinner size="large" />
      </div>
    )
  }

  return (
    <Context.Provider value={{ user, setUser }}>
      <>{children}</>
    </Context.Provider>
  )
}

export const useSession = () => useContext(Context)
