import CreateForum from '@revit/app/features/forum/Create'
import { ScrollView, View } from '@revit/ui'
import { useRouter } from 'expo-router'

const CreateForumScreen = () => {
  const router = useRouter()
  const handleClose = () => {
    router.replace('/forums')
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
        <CreateForum handleClose={handleClose} />
      </ScrollView>
    </View>
  )
}

export default CreateForumScreen
