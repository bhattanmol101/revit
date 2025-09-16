'use client'

import { fetchLoggedInUserAction } from '@/app/action'
import { UserT } from '@revit/shared/types/user'
import { Spinner } from '@revit/ui'
import { createContext, useContext, useEffect, useState } from 'react'

type MaybeUser = UserT | null

type UserContext = {
  user: MaybeUser
  setUser: (user: MaybeUser) => void
}

// @ts-ignore
const Context = createContext<UserContext>()

export default function ContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MaybeUser>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const user = await fetchLoggedInUserAction()

      if (user) {
        setUser(user as UserT)
      }
      setLoading(false)
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
