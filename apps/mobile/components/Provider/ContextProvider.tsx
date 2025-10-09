import { fetchLoggedInUser } from '@revit/api/auth/user'
import { UserT } from '@revit/shared/types/user'
import { createContext, useContext, useEffect, useState } from 'react'
import { useAuthStore } from '@revit/app/store'

type MaybeUser = UserT | null

type UserContext = {
  user: MaybeUser
  initialized?: boolean
  setUser: (user: MaybeUser) => void
  signOut?: () => void
}

// @ts-ignore
const Context = createContext<UserContext>()

export default function ContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MaybeUser>(null)
  const [initialized, setInitialized] = useState<boolean>(false)

  const { loading, fetchUser } = useAuthStore()

  useEffect(() => {
    const getUser = async () => {
      const { user, error } = await fetchLoggedInUser()
      if (error) {
        //TODO need to see what to do in this case
      }
      setInitialized(true)

      if (user) {
        setUser(user as UserT)
      }
    }

    fetchUser()

    getUser()
  }, [])

  return (
    <Context.Provider value={{ user, setUser, initialized }}>
      <>{children}</>
    </Context.Provider>
  )
}

export const useSession = () => useContext(Context)
