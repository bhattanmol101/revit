// components/ImagePicker.tsx
'use client'

import { useRef, useState } from 'react'
import { Button, Image, ScrollView, useWindowDimensions, XStack, YStack } from 'tamagui'
import { ChevronLeft, ChevronRight, ImageUp, X } from '@tamagui/lucide-icons'
import * as ImagePickerExpo from 'expo-image-picker'
import { useToastController } from '@tamagui/toast'

export function ImagePicker({
  name = 'Pick Images',
  maxImages = 5,
  height = 500,
  handleImageChange,
}: {
  name?: string
  maxImages?: number
  height?: number
  handleImageChange: (images: (File | string)[]) => void
}) {
  const toast = useToastController()

  const [images, setImages] = useState<{ uri: string; file: File | string }[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [parentWidth, setParentWidth] = useState(0)
  const scrollRef = useRef<any>(null)

  const pickImages = async () => {
    if (typeof window !== 'undefined' && !('expo' in window)) {
      // Web: multi-file selection
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.multiple = true
      input.onchange = (e: any) => {
        const files = Array.from(e.target.files)
        const selected = files.map((file: any) => ({
          uri: URL.createObjectURL(file),
          file,
        }))

        const newFiles = [...images, ...selected]
        if (newFiles.length > maxImages) {
          toast.show('Too many images!', {
            message: `Please select maximum ${maxImages} images.`,
            customData: { type: 'error' },
          })
          return
        }

        setImages(newFiles)
        handleImageChange(newFiles.flatMap((obj) => obj.file))
      }
      input.click()
    } else {
      // Native (Expo)
      const result = await ImagePickerExpo.launchImageLibraryAsync({
        mediaTypes: ImagePickerExpo.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: maxImages,
        quality: 1,
        base64: true,
      })

      if (!result.canceled) {
        let selected: { uri: string; file: string }[] = []
        result.assets.map((asset) => {
          if (asset.base64) {
            selected.push({ uri: asset.uri, file: asset.base64 })
          }
        })

        if (selected.length > 0) {
          const newSelected = [...images, ...selected]
          setImages(newSelected)
          handleImageChange(newSelected.flatMap((obj) => obj.file))
        }
      }
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    if (activeIndex >= images.length - 1) {
      setActiveIndex(Math.max(0, images.length - 2))
    }
  }

  const handleMomentumEnd = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / parentWidth)
    setActiveIndex(index)
  }
  const goToIndex = (index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: index * parentWidth, animated: true })
      setActiveIndex(index)
    }
  }

  return (
    <YStack gap="$3" onLayout={(e) => setParentWidth(e.nativeEvent.layout.width)}>
      <XStack>
        <Button onPress={pickImages} width="100%">
          <Button.Icon>
            <ImageUp size="$1" />
          </Button.Icon>
          <Button.Text>Add Image</Button.Text>
        </Button>
      </XStack>
      <YStack gap="$1">
        {images.length > 0 && (
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleMomentumEnd}
            width={parentWidth}
          >
            <XStack>
              {images.map((img, index) => (
                <YStack key={index} pos="relative" w={parentWidth} h={height}>
                  <Image src={img.uri} w={parentWidth} h={height} objectFit="cover" />
                  <Button
                    size="$2"
                    circular
                    pos="absolute"
                    t="$3"
                    r="$3"
                    icon={<X color="$red11" />}
                    onPress={() => removeImage(index)}
                    bg="$black10"
                    color="white"
                  />
                </YStack>
              ))}
            </XStack>
          </ScrollView>
        )}

        {/* Left Chevron */}
        {activeIndex > 0 && (
          <Button
            size="$2"
            circular
            pos="absolute"
            l="$3"
            t="45%"
            icon={ChevronLeft}
            bg="$black10"
            color="white"
            onPress={() => goToIndex(activeIndex - 1)}
          />
        )}

        {/* Right Chevron */}
        {activeIndex < images.length - 1 && (
          <Button
            size="$2"
            circular
            pos="absolute"
            r="$3"
            t="45%"
            icon={ChevronRight}
            bg="$black10"
            color="white"
            onPress={() => goToIndex(activeIndex + 1)}
          />
        )}

        {/* Dots indicator */}
        <XStack mt="$2" gap="$2" pos="absolute" b="$3" l="50%">
          {images.map((_, i) => (
            <YStack key={i} w={6} h={6} br={50} bg={i === activeIndex ? '$white2' : '$white11'} />
          ))}
        </XStack>
      </YStack>
    </YStack>
  )
}
