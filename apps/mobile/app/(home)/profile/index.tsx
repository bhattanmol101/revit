import Profile from '@revit/app/features/profile'
import { useSession } from '../../../components/Provider/ContextProvider'

function ProfileScreen() {
  const { user } = useSession()
  if (!user) {
    return
  }

  return <Profile userId={user.id} user={user} />
}

export default ProfileScreen
