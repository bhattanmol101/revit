'use client'

import { useState } from 'react'
import { Send } from '@tamagui/lucide-icons'
import {
  Button,
  FieldError,
  ImagePicker,
  InputField,
  Label,
  SelectInput,
  Shake,
  TextArea,
  Theme,
  useToastController,
  View,
  XStack,
  YStack,
} from '@revit/ui'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { createForumSchema, CreateForumT } from '@revit/shared/types/forum'
import { zodResolver } from '@hookform/resolvers/zod'
import { createForumApi } from '@revit/api/forum'
import Loader from '../common/Loader'
import { StatusT } from '@revit/shared/types/common'
import { IDLE, LOADING } from '@revit/shared/utils/constants'
import { useForumStore } from '../../store/forum.store'

const CreateForum = ({ handleClose }: { handleClose: () => void }) => {
  const toast = useToastController()
  const [status, setStatus] = useState<StatusT>(IDLE)

  const { fetchUserForums } = useForumStore()

  const { control, getValues, setValue, clearErrors, handleSubmit } = useForm<CreateForumT>({
    resolver: zodResolver(createForumSchema),
  })

  const onSubmit: SubmitHandler<CreateForumT> = async (data: CreateForumT) => {
    const image = getValues('image')
    if (!image) {
      toast.show('Forum image empty!', {
        message: 'Please provide image for you forum.',
        customData: { type: 'error' },
      })
      return
    }

    setStatus(LOADING)

    data.image = image
    const error = await createForumApi(data)
    setStatus(IDLE)
    if (error) {
      console.log(error)
      return
    }
    fetchUserForums({ refresh: true })
    handleClose()
  }

  const handleImageChange = (images: (File | string)[]) => {
    setValue('image', images[0])
    clearErrors('image')
  }

  const items = [
    { label: 'Healthcare', value: 'healthcare' },
    { label: 'Software', value: 'software' },
    { label: 'Hotels', value: 'hotels' },
    { label: 'Restaurants', value: 'restaurants' },
    { label: 'Movies', value: 'movies' },
    { label: 'Entertainment', value: 'entertainment' },
  ]

  return (
    <YStack flex={1} gap="$4">
      <View mt="$2">
        <Controller
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Theme name={error ? 'red' : null} forceClassName>
              <Shake shakeKey={String(error)}>
                <TextArea
                  width="100%"
                  color="$white3"
                  minHeight="$10"
                  placeholder="Explain about your forum...."
                  value={value}
                  onChangeText={onChange}
                  unstyled
                  scrollbarWidth="none"
                  verticalAlign="top"
                />
                <FieldError message={error ? String(error.message) : ''} />
              </Shake>
            </Theme>
          )}
          name="description"
        />
      </View>

      <Controller
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <InputField
            id="name"
            label="Forum Name"
            placeholder="Give a name to your forum..."
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
          <XStack ai="center" gap="$4">
            <Label htmlFor="select" miw={80}>
              Forum Category
            </Label>
            <SelectInput
              value={value}
              onValueChange={onChange}
              items={items}
              error={error ? error.message : ''}
            />
          </XStack>
        )}
        name="category"
      />

      {/* Review Image Section */}
      <Controller
        control={control}
        render={({ fieldState: { error } }) => (
          <Theme name={error ? 'red' : null} forceClassName>
            <Shake shakeKey={String(error)}>
              <ImagePicker
                name="Pick Forum Image"
                height={250}
                maxImages={1}
                handleImageChange={handleImageChange}
              />
              <FieldError message={error ? String(error.message) : ''} />
            </Shake>
          </Theme>
        )}
        name="image"
      />

      {/* Post Button */}
      <View paddingBottom="$5" marginTop="$4">
        <Theme inverse>
          <Button onPress={handleSubmit(onSubmit)} size="$4" iconAfter={<Loader status={status} />}>
            <Button.Icon>
              <Send size={20} />
            </Button.Icon>
            <Button.Text fontWeight={500}>Create Forum</Button.Text>
          </Button>
        </Theme>
      </View>
    </YStack>
  )
}

export default CreateForum
