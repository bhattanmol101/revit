import { ScrollView } from '@revit/ui'
import CreatePost from '@revit/app/features/post/Create'

const CreatePostScreen = () => {
  return (
    <ScrollView flex={1} paddingTop="$3">
      <CreatePost />
    </ScrollView>
  )
}

export default CreatePostScreen
