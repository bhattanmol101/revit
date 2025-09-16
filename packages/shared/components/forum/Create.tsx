'use client'

import { useState } from 'react'
import { Plus, Send, X } from '@tamagui/lucide-icons'
import {
  Button,
  ImagePicker,
  Text,
  TextArea,
  View,
  YStack,
  useToastController,
  Shake,
  Theme,
  InputField,
  Dialog,
  Unspaced,
} from '@revit/ui'
import { FieldError } from '@revit/ui'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { ForumCreateFormType, forumCreateSchema } from '../../validators/ForumSchema'
import { zodResolver } from '@hookform/resolvers/zod'

const CreateForumDialog = () => {
  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        <Button chromeless>
          <Button.Icon>
            <Plus size={24} />
          </Button.Icon>
          <Button.Text>Create Revit Forum</Button.Text>
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
            <Dialog.Title fontSize="$2">Create your Revit Forum</Dialog.Title>

            <CreateForum />

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

const CreateForum = ({
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

  const [imageUri, setImageUri] = useState<string[]>()

  const { control, handleSubmit } = useForm<ForumCreateFormType>({
    resolver: zodResolver(forumCreateSchema),
  })

  const onSubmit: SubmitHandler<ForumCreateFormType> = (data: ForumCreateFormType) => {
    console.log(data)
    if (!imageUri)
      toast.show('Forum image empty!', {
        message: 'Please provide image for you forum.',
        customData: { type: 'error' },
      })
  }

  const handleImageChange = (images: string[]) => {
    setImageUri(images)
  }

  return (
    <YStack flex={1} gap="$3">
      {/* Review Image Section */}
      <YStack borderRadius="$5" backgroundColor="$black3" padding="$4">
        <ImagePicker name="Pick Forum Image" maxImages={1} handleImageChange={handleImageChange} />
      </YStack>

      {/* Review Details Section */}
      <YStack borderRadius="$5" backgroundColor="$black3" padding="$4" gap="$4">
        <Controller
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputField
              id="name"
              label=""
              placeholder="Give a title to your forum..."
              onChangeText={onChange}
              value={value}
              error={error ? error.message : ''}
            />
          )}
          name="name"
        />
        <Controller
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Theme name={error ? 'red' : null} forceClassName>
              <Shake shakeKey={String(error)}>
                <TextArea
                  width="100%"
                  borderWidth={1}
                  id="description"
                  value={value}
                  placeholder="Explain about your forum...."
                  onChangeText={onChange}
                />
                <FieldError message={error ? String(error.message) : ''} />
              </Shake>
            </Theme>
          )}
          name="description"
        />
      </YStack>

      {/* Post Button */}
      <View paddingBottom="$5" paddingTop="$2">
        <Button onPress={handleSubmit(onSubmit)} size="$4">
          <Send size={20} />
          <Text className="text-md">Create Forum</Text>
        </Button>
      </View>
    </YStack>
  )
}

export default CreateForumDialog
