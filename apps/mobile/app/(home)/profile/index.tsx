import Profile from '@revit/app/features/profile'
import { useAuthStore } from '@revit/app/store'

function ProfileScreen() {
  const { user } = useAuthStore()
  if (!user) {
    return
  }

  return <Profile userId={user.id} user={user} />
}

export default ProfileScreen
