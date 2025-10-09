import { EditProfile } from '@revit/app/features/profile/Edit'
import { useSession } from '../../../components/Provider/ContextProvider'
import { ScrollView, View } from '@revit/ui'
import { useRouter } from 'expo-router'

function ProfileEditScreen() {
  const { user } = useSession()
  if (!user) {
    return
  }

  const router = useRouter()
  const handleClose = () => {
    router.replace('/profile')
  }

  return (
    <View
      flex={1}
      paddingHorizontal="$3"
      paddingVertical="$2"
      borderWidth={1}
      borderRadius="$5"
      borderColor="$black4"
      margin="$2"
    >
      <ScrollView>
        <EditProfile user={user} handleClose={handleClose} />
      </ScrollView>
    </View>
  )
}

export default ProfileEditScreen
