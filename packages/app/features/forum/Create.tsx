'use client'

import { useState } from 'react'
import { Plus, Send, X } from '@tamagui/lucide-icons'
import {
  Button,
  ImagePicker,
  TextArea,
  View,
  YStack,
  useToastController,
  Shake,
  Theme,
  InputField,
  Dialog,
  Unspaced,
  SelectInput,
  XStack,
  Label,
} from '@revit/ui'
import { FieldError } from '@revit/ui'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { CreateForumT, createForumSchema } from '@revit/shared/types/forum'
import { zodResolver } from '@hookform/resolvers/zod'
import { createForumApi } from '@revit/api/forum'
import Loader from '../common/Loader'
import { StatusT } from '@revit/shared/types/common'
import { IDLE, LOADING } from '@revit/shared/utils/constants'

const CreateForumDialog = () => {
  const [open, onOpen] = useState(false)

  const onOpenChange = () => {
    onOpen(!open)
  }

  const handleClose = () => {
    onOpen(false)
  }

  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
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
            elevate
            width={600}
            minHeight={250}
            maxHeight={800}
            style={{ overflowY: 'auto', scrollbarWidth: 'thin' }}
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
            <Dialog.Title
              fontSize="$2"
              borderBottomWidth={1}
              borderBottomColor="$black7"
              pb="$3"
              px="$2"
            >
              Create your Revit Forum
            </Dialog.Title>

            <CreateForum handleClose={handleClose} />

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

const CreateForum = ({ handleClose }: { handleClose: () => void }) => {
  const toast = useToastController()
  const [status, setStatus] = useState<StatusT>(IDLE)

  const { control, getValues, setValue, clearErrors, handleSubmit } = useForm<CreateForumT>({
    resolver: zodResolver(createForumSchema),
  })

  const onSubmit: SubmitHandler<CreateForumT> = async (data: CreateForumT) => {
    console.log(data)
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
    handleClose()
  }

  const handleImageChange = (images: (File | string)[]) => {
    setValue('image', images[0])
    clearErrors('image')
  }

  const items = [{ name: 'health' }]

  return (
    <YStack flex={1} gap="$4">
      {/* Review Details Section */}

      <View mt="$2">
        <Controller
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Theme name={error ? 'red' : null} forceClassName>
              <Shake shakeKey={String(error)}>
                <TextArea
                  width="100%"
                  color="$white3"
                  height="$10"
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
              id="select"
              label="Forum Category"
              onChange={onChange}
              items={items}
              selected={value}
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

export default CreateForumDialog
