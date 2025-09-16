'use client'

import { useState } from 'react'
import { Alert, Dimensions } from 'react-native'
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

const CreatePost = ({
  handlePost,
}: {
  handlePost?: ({
    images,
    description,
    rating,
  }: {
    images?: string[]
    description: string
    rating: number
  }) => void
}) => {
  const toast = useToastController()

  const [rating, setRating] = useState(0)
  const [error, setError] = useState('')
  const [description, setDescription] = useState('')
  const [checked, setChecked] = useState(false)
  const [imageUri, setImageUri] = useState<string[]>()

  const onCheckedChange = () => {
    setChecked(!checked)
  }

  const handleImageChange = (images: string[]) => {
    setImageUri(images)
  }

  const handleDescriptionChange = (value: string) => {
    if (error) {
      setError('')
    }
    setDescription(value)
  }

  const handleCreatePost = () => {
    if (!description.trim()) {
      setError('description')
      return
    }
    if (checked && rating === 0) {
      toast.show('Post rating empty!', {
        message: 'Please provide rating on a scale of 1 to 5.',
        customData: { type: 'error' },
      })
      return
    }

    console.log({ imageUri, description, rating })

    // handlePost({ images: imageUri, description, rating })
  }

  const handleRatingChange = (value: number) => {
    console.log('User selected rating:', value)
  }

  return (
    <YStack flex={1} gap="$3">
      {/* Review Image Section */}
      <YStack borderRadius="$5" backgroundColor="$black3" padding="$4">
        <ImagePicker handleImageChange={handleImageChange} />
      </YStack>

      {/* Review Details Section */}
      <YStack borderRadius="$5" backgroundColor="$black3" padding="$4">
        <Theme name={error ? 'red' : null} forceClassName>
          <Shake shakeKey={error}>
            <TextArea
              width="100%"
              borderWidth={1}
              placeholder="Share your experince or get something reviewd...."
              value={description}
              onChangeText={handleDescriptionChange}
            />
            <FieldError message={error} />
          </Shake>
        </Theme>
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
            <GetRating size={20} onChange={handleRatingChange} />
          </XStack>
        )}
      </YStack>

      {/* Post Button */}
      <View paddingBottom="$5" paddingTop="$2">
        <Button onPress={handleCreatePost} size="$4">
          <Send size={20} />
          <Text className="text-md">Post</Text>
        </Button>
      </View>
    </YStack>
  )
}

export default CreatePost
