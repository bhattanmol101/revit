import { signIn } from '@revit/api/auth/signin'
import Signin from '@revit/app/features/signin'
import { YStack } from '@revit/ui'
import { useSession } from '../../components/Provider/ContextProvider'
import { UserSigninT } from '@revit/shared/types/user'
import { fetchLoggedInUser } from '@revit/api/auth/user'

export default function Screen() {
  const { setUser } = useSession()

  const siginInHandler = async (userSignin: UserSigninT): Promise<Error | undefined> => {
    const signInError = await signIn(userSignin)
    if (signInError) {
      return signInError
    }

    const { user, error } = await fetchLoggedInUser()
    if (error) {
      return error
    }
    if (user) {
      setUser(user)
    } else {
      return new Error('user not found!')
    }
  }
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" paddingHorizontal="30">
      <Signin handleSignin={siginInHandler} />
    </YStack>
  )
}
