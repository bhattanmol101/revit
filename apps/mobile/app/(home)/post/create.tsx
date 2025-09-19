import { ScrollView, Text, YStack } from '@revit/ui'
import CreatePost from '@revit/app/features/post/Create'
import { SafeAreaView } from 'react-native-safe-area-context'

function CreatePostScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView flex={1}>
        <YStack gap="$3">
          <YStack
            borderRadius="$5"
            backgroundColor="$black3"
            paddingVertical="$3"
            paddingHorizontal="$2"
          >
            <Text>Create Revit Post</Text>
          </YStack>
          <CreatePost />
        </YStack>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CreatePostScreen
