import { ScrollView, View } from '@revit/ui'
import CreatePost from '@revit/app/features/post/Create'
import { useRouter } from 'expo-router'

const CreatePostScreen = () => {
  const router = useRouter()

  const handleClose = () => {
    router.replace('/home')
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
        <CreatePost handleClose={handleClose} />
      </ScrollView>
    </View>
  )
}

export default CreatePostScreen
