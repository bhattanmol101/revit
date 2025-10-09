import Profile from '@revit/app/features/profile'
import { useParams } from 'solito/navigation'

const UserProfileScreen = () => {
  const { id } = useParams()
  if (!id) {
    return null
  }

  return <Profile userId={String(id)} />
}

export default UserProfileScreen
