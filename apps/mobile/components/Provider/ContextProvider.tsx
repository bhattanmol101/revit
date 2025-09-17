import { fetchLoggedInUser } from '@revit/api/auth/user'
import { UserT } from '@revit/shared/types/user'
import { Spinner, View } from '@revit/ui'
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
      const { user, error } = await fetchLoggedInUser()
      if (error) {
        //TODO need to see what to do in this case
      }

      if (user) {
        setUser(user as UserT)
      }
      setLoading(false)
    }

    getUser()
  }, [])

  if (loading) {
    return (
      <View flex={1} alignItems="center" justifyContent="center">
        <Spinner size="large" />
      </View>
    )
  }

  return (
    <Context.Provider value={{ user, setUser }}>
      <>{children}</>
    </Context.Provider>
  )
}

export const useSession = () => useContext(Context)
