'use client'

import { useState } from 'react'
import { KeyboardAvoidingView } from 'react-native'
import { Send } from '@tamagui/lucide-icons'
import {
  Button,
  FieldError,
  ImagePicker,
  Shake,
  SwitchWithLabel,
  Text,
  TextArea,
  Theme,
  useToastController,
  View,
  XStack,
  YStack,
} from '@revit/ui'
import GetRating from '../common/GetRating'
import { createPostApi } from '@revit/api/post'
import Loader from '../common/Loader'
import { StatusT } from '@revit/shared/types/common'
import { FAILED, IDLE, LOADING, SUCCESS } from '@revit/shared/utils/constants'
import { useFeedStore } from '../../store'

const CreatePost = ({ handleClose }: { handleClose: () => void }) => {
  const toast = useToastController()

  const { fetchFeed } = useFeedStore()

  const [rating, setRating] = useState(0)
  const [error, setError] = useState('')
  const [caption, setCaption] = useState('')
  const [checked, setChecked] = useState(false)
  const [images, setImages] = useState<(File | string)[] | undefined>()
  const [status, setStatus] = useState<StatusT>(IDLE)

  const onCheckedChange = () => {
    setChecked(!checked)
  }

  const handleImageChange = (images: (File | string)[]) => {
    setImages(images)
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

    const post = { caption, images, rating }

    setStatus(LOADING)
    const error = await createPostApi(post)
    setStatus(IDLE)

    if (error) {
      setStatus(FAILED)
      return
    }

    fetchFeed({ refresh: true })
    setStatus(SUCCESS)
    handleClose()
  }

  return (
    <YStack flex={1} gap="$6" minWidth="100%" justifyContent="space-between">
      {/* Review Details Section */}
      <YStack gap="$3">
        <KeyboardAvoidingView>
          <Theme name={error ? 'red' : null}>
            <Shake shakeKey={error}>
              <TextArea
                width="100%"
                color="$white3"
                minHeight="$10"
                placeholder="Share your experince or get something reviewd...."
                value={caption}
                onChangeText={handleCaptionChange}
                unstyled
                scrollbarWidth="none"
                verticalAlign="top"
              />
              <FieldError message={error} />
            </Shake>
          </Theme>
        </KeyboardAvoidingView>
        {/* Review Image Section */}
        <ImagePicker handleImageChange={handleImageChange} />

        {/* Review Rating Section */}
        <YStack gap="$2">
          <SwitchWithLabel
            label="Rate to your post?"
            size="$1"
            checked={checked}
            onCheckedChange={onCheckedChange}
          />
          {checked && (
            <XStack alignItems="center" gap="$2">
              <Text fontSize="$3">Provide your rating:</Text>
              <GetRating size={20} rating={rating} onChange={setRating} />
            </XStack>
          )}
        </YStack>
      </YStack>

      {/* Post Button */}
      <View paddingBottom="$5" paddingTop="$2">
        <Theme inverse>
          <Button onPress={handleCreatePost} size="$4" iconAfter={<Loader status={status} />}>
            <Send size={20} />
            <Text className="text-md">Post</Text>
          </Button>
        </Theme>
      </View>
    </YStack>
  )
}

export default CreatePost
