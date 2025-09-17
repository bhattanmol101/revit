// components/ImagePicker.tsx
'use client'

import { useState } from 'react'
import { Button, Image, XStack, YStack } from 'tamagui'

// For native: expo-image-picker
// For web: <input type="file" />
import * as ImagePickerExpo from 'expo-image-picker'

export function ImagePicker({
  name = 'Pick Images',
  maxImages = 5,
  handleImageChange,
}: {
  name?: string
  maxImages?: number
  handleImageChange: (images: File) => void
}) {
  const [imageUri, setImageUri] = useState<string | null>(null)

  // Handle picking image (web + native)
  const pickImage = async () => {
    if (typeof window !== 'undefined' && !('expo' in window)) {
      // Web
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = (e: any) => {
        const file = e.target.files[0]
        if (file) {
          const url = URL.createObjectURL(file)
          setImageUri(url)
          handleImageChange(file)
        }
      }
      input.click()
    } else {
      // Native (Expo)
      const permission = await ImagePickerExpo.requestMediaLibraryPermissionsAsync()
      if (permission.granted === false) {
        alert('Permission required to access gallery!')
        return
      }
      const result = await ImagePickerExpo.launchImageLibraryAsync({
        mediaTypes: ImagePickerExpo.MediaTypeOptions.Images,
        quality: 1,
      })
      if (!result.canceled) {
        const asset = result.assets[0]
        setImageUri(asset.uri)
        const response = await fetch(asset.uri)
        const blob = await response.blob()
        const file = new File([blob], `upload-${Date.now()}.jpg`, {
          type: 'image/jpeg',
        })
        handleImageChange(file)
      }
    }
  }

  return (
    <YStack ai="center" jc="center" space="$4" p="$4">
      <Button onPress={pickImage}>Pick an Image</Button>

      {imageUri && (
        <XStack ai="center" jc="center" mt="$4">
          <Image source={{ uri: imageUri }} width={200} height={200} />
        </XStack>
      )}
    </YStack>
  )
}
