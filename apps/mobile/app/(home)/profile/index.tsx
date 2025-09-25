import { SafeAreaView } from 'react-native-safe-area-context'
import Profile from '@revit/app/features/profile'
import { useSession } from '../../../components/Provider/ContextProvider'

function ProfileScreen() {
  const { user } = useSession()
  if (!user) {
    return
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom', 'left', 'right']}>
      <Profile user={user} />
    </SafeAreaView>
  )
}

export default ProfileScreen
