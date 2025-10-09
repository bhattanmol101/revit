'use client'

import { useEffect, useState } from 'react'
import { Camera, Edit3, Send, X } from '@tamagui/lucide-icons'
import {
  Button,
  Dialog,
  FieldError,
  InputField,
  Shake,
  TextArea,
  Theme,
  Unspaced,
  useToastController,
  View,
  YStack,
} from '@revit/ui'
import Avatar from '../common/Avatar'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { updateUserSchema, UpdateUserT, UserT } from '@revit/shared/types/user'
import { zodResolver } from '@hookform/resolvers/zod'
import * as ImagePickerExpo from 'expo-image-picker'
import { updateUserApi } from '@revit/api/user'
import { IDLE, LOADING, SUCCESS } from '@revit/shared/utils/constants'
import { StatusT } from '@revit/shared/types/common'
import Loader from '../common/Loader'

const EditProfileDialog = ({ user }: { user: UserT }) => {
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
            pt="$4"
            pb="$2"
            elevate
            width={500}
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
            <Dialog.Title fontSize="$2">Edit your profile</Dialog.Title>

            <EditProfile user={user} handleClose={handleClose} />

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

export const EditProfile = ({ user, handleClose }: { user: UserT; handleClose: () => void }) => {
  const toast = useToastController()

  const [status, setStatus] = useState<StatusT>(IDLE)
  const [image, setImage] = useState<{ uri: string; file: File | string }>()

  const { control, handleSubmit } = useForm<UpdateUserT>({
    resolver: zodResolver(updateUserSchema),
    values: {
      name: user.name,
      bio: user.bio || '',
    },
  })

  const onSubmit: SubmitHandler<UpdateUserT> = async (data: UpdateUserT) => {
    setStatus(LOADING)
    data.avatar = image?.file
    const error = await updateUserApi(user, data)
    setStatus(IDLE)
    if (error) {
      toast.show('Failed to update user!', {
        message: 'Something went wrong! Please try again.',
        customData: { type: 'error' },
      })
      return
    }
    setStatus(SUCCESS)
    handleClose()
  }

  const pickImage = async () => {
    if (typeof window !== 'undefined' && !('expo' in window)) {
      // Web: multi-file selection
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.multiple = true
      input.onchange = (e: any) => {
        const files = Array.from(e.target.files) as File[]
        const selected = {
          uri: URL.createObjectURL(files[0]),
          file: files[0],
        }

        setImage(selected)
      }
      input.click()
    } else {
      // Native (Expo)
      const result = await ImagePickerExpo.launchImageLibraryAsync({
        mediaTypes: ImagePickerExpo.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        selectionLimit: 1,
        quality: 1,
        base64: true,
      })

      if (!result.canceled) {
        const asset = result.assets[0]
        if (asset.base64) {
          setImage({ uri: asset.uri, file: asset.base64 })
        }
      }
    }
  }

  useEffect(() => {
    return () => {
      setStatus(IDLE)
    }
  }, [])

  return (
    <YStack flex={1} gap="$4">
      {/* Review Image Section */}
      <YStack alignItems="center" padding="$3">
        <View className="relative">
          <Avatar size="$10" image={image?.uri || user.avatar} />

          <Button
            size="$2"
            position="absolute"
            bottom={0}
            right={0}
            borderRadius="$10"
            bg="$black8"
            borderWidth={1}
            zIndex={10}
            onPress={pickImage}
          >
            <Button.Icon>
              <Camera size={14} color="white" />
            </Button.Icon>
          </Button>
        </View>
      </YStack>

      {/* Review Details Section */}
      <YStack gap="$4">
        <Controller
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputField
              id="name"
              label=""
              placeholder="Please enter your name"
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
                  color="$white3"
                  height="$7"
                  placeholder="Write your bio...."
                  value={value}
                  onChangeText={onChange}
                  scrollbarWidth="none"
                  verticalAlign="top"
                />
                <FieldError message={error ? String(error.message) : ''} />
              </Shake>
            </Theme>
          )}
          name="bio"
        />
      </YStack>
      {/* Post Button */}
      <View paddingBottom="$5" paddingTop="$2" mt="$2">
        <Theme inverse>
          <Button
            onPress={handleSubmit(onSubmit)}
            iconAfter={<Loader status={status} />}
            disabled={status === LOADING}
          >
            <Button.Icon>
              <Send size={18} />
            </Button.Icon>
            <Button.Text marginTop="$1.5">Edit Profile</Button.Text>
          </Button>
        </Theme>
      </View>
    </YStack>
  )
}

export default EditProfileDialog
