'use client'

import { useState } from 'react'
import { Camera, Edit3, Send, X } from '@tamagui/lucide-icons'
import {
  Button,
  Text,
  TextArea,
  View,
  YStack,
  useToastController,
  Shake,
  Theme,
  Image,
  InputField,
  Dialog,
  Unspaced,
} from '@revit/ui'
import { FieldError } from '@revit/ui'

const EditProfileDialog = ({
  user,
  handlePost,
}: {
  user: any
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
  const [rating, setRating] = useState(0)
  const [checked, setChecked] = useState(false)
  const [imageUri, setImageUri] = useState<string[]>()

  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        <Button variant="outlined" size="$2">
          <Button.Icon>
            <Edit3 size={14} color="white" />
          </Button.Icon>
          <Button.Text>Edit Profile</Button.Text>
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal width={300}>
        <Dialog.Overlay
          key="overlay"
          backgroundColor="$shadowColor"
          animateOnly={['transform', 'opacity']}
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.FocusScope focusOnIdle>
          <Dialog.Content
            bordered
            paddingVertical="$4"
            paddingHorizontal="$6"
            elevate
            minWidth={600}
            minHeight={250}
            borderRadius="$6"
            key="content"
            animateOnly={['transform', 'opacity']}
            animation={[
              'quick',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: 20, opacity: 0 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            gap="$4"
          >
            <Dialog.Title fontSize="$2">Edit your profile</Dialog.Title>

            <EditProfile user={user} />

            <Unspaced>
              <Dialog.Close asChild>
                <Button position="absolute" right="$3" size="$2" circular icon={X} />
              </Dialog.Close>
            </Unspaced>
          </Dialog.Content>
        </Dialog.FocusScope>
      </Dialog.Portal>
    </Dialog>
  )
}

const EditProfile = ({ user }: { user: any }) => {
  const toast = useToastController()
  const [error, setError] = useState('')
  const [description, setDescription] = useState('')

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

    toast.show('Post rating empty!', {
      message: 'Please provide rating on a scale of 1 to 5.',
      customData: { type: 'error' },
    })
    return

    // handlePost({ images: imageUri, description, rating })
  }

  return (
    <YStack flex={1} gap="$3">
      {/* Review Image Section */}
      <YStack alignItems="center" borderRadius="$5" backgroundColor="$black3" padding="$4">
        <View className="relative">
          <Image
            source={{ uri: user.avatar }}
            height={100}
            width={100}
            borderRadius={50}
            borderColor="$white0"
            alt="user image"
          />
          <Button
            size="$2"
            position="absolute"
            bottom={0}
            right={0}
            borderRadius="$10"
            borderColor="$white0"
            borderWidth={1}
          >
            <Button.Icon>
              <Camera size={14} color="white" />
            </Button.Icon>
          </Button>
        </View>
      </YStack>

      {/* Review Details Section */}
      <YStack borderRadius="$5" backgroundColor="$black3" padding="$4" gap="$2">
        <InputField id="name" placeholder="John Doe" value={user.name} />
        <Theme name={error ? 'red' : null} forceClassName>
          <Shake shakeKey={error}>
            <TextArea
              width="100%"
              borderWidth={1}
              placeholder="Add your bio..."
              value={description}
              onChangeText={handleDescriptionChange}
            />
            <FieldError message={error} />
          </Shake>
        </Theme>
      </YStack>

      {/* Post Button */}
      <View paddingBottom="$5" paddingTop="$2">
        <Button onPress={handleCreatePost}>
          <Button.Icon>
            <Send size={18} />
          </Button.Icon>
          <Button.Text>Edit Profile</Button.Text>
        </Button>
      </View>
    </YStack>
  )
}

export default EditProfileDialog
