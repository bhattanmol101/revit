import { Text } from '@revit/ui'
import { SafeAreaView } from 'react-native-safe-area-context'

function Profile() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom', 'left', 'right']}>
      <Text>Explore</Text>
    </SafeAreaView>
  )
}

export default Profile
