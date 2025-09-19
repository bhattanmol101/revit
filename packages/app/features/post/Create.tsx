'use client'

import { useState } from 'react'
import { Alert, Dimensions, KeyboardAvoidingView } from 'react-native'
import { Send } from '@tamagui/lucide-icons'
import {
  Button,
  SwitchWithLabel,
  ImagePicker,
  Input,
  Text,
  TextArea,
  View,
  XStack,
  YStack,
  useToastController,
  Shake,
  Theme,
} from '@revit/ui'
import GetRating from '../common/GetRating'
import { FieldError } from '@revit/ui'
import { createPost } from '@revit/api/post'

const CreatePost = () => {
  const toast = useToastController()

  const [rating, setRating] = useState(0)
  const [error, setError] = useState('')
  const [caption, setCaption] = useState('')
  const [checked, setChecked] = useState(false)
  const [image, setImage] = useState<File | undefined>()

  const onCheckedChange = () => {
    setChecked(!checked)
  }

  const handleImageChange = (images: File) => {
    setImage(images)
  }

  const handleCaptionChange = (value: string) => {
    if (error) {
      setError('')
    }
    setCaption(value)
  }

  const handleCreatePost = async () => {
    if (!caption.trim()) {
      setError('caption')
      return
    }
    if (checked && rating === 0) {
      toast.show('Post rating empty!', {
        message: 'Please provide rating on a scale of 1 to 5.',
        customData: { type: 'error' },
      })
      return
    }

    const post = { caption, image, rating }

    await createPost(post)
  }

  const handleRatingChange = (value: number) => {
    console.log('User selected rating:', value)
  }

  return (
    <YStack flex={1} gap="$3" minWidth='100%'>
      {/* Review Details Section */}
      <YStack borderRadius="$5" backgroundColor="$black3" padding="$4">
        <KeyboardAvoidingView>
          <Theme name={error ? 'red' : null}>
            <Shake shakeKey={error}>
              <TextArea
                numberOfLines={10}
                placeholder="Share your experince or get something reviewd...."
                value={caption}
                onChangeText={handleCaptionChange}
              />
              <FieldError message={error} />
            </Shake>
          </Theme>
        </KeyboardAvoidingView>
      </YStack>
      {/* Review Image Section */}
      <YStack borderRadius="$5" backgroundColor="$black3" padding="$4">
        <ImagePicker handleImageChange={handleImageChange} />
      </YStack>

      {/* Review Rating Section */}
      <YStack borderRadius="$5" backgroundColor="$black3" padding="$4" gap="$2">
        <SwitchWithLabel
          label="Provide rating to your post?"
          size="$1"
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
        {checked && (
          <XStack alignItems="center" gap="$2">
            <Text fontSize="$3">Provide your rating:</Text>
            <GetRating size={20} rating={rating} setRating={setRating} />
          </XStack>
        )}
      </YStack>

      {/* Post Button */}
      <View paddingBottom="$5" paddingTop="$2">
        <Theme inverse>
          <Button onPress={handleCreatePost} size="$4">
            <Send size={20} />
            <Text className="text-md">Post</Text>
          </Button>
        </Theme>
      </View>
    </YStack>
  )
}

export default CreatePost
