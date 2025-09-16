import { X } from '@tamagui/lucide-icons'
import { useId, useState } from 'react'
import { Button, Image, Label, View, XStack } from 'tamagui'
import { useFilePicker } from './elements/useFilePicker'
import { MediaTypeOptions } from './elements/types'
import { useToastController } from '@tamagui/toast'

/** ------ EXAMPLE ------ */
export function ImagePicker({ name ="Pick Images", maxImages = 5,  handleImageChange }: { name?: string, maxImages?: number, handleImageChange: (images: string[]) => void }) {
  const toast = useToastController()

  const id = useId()
  const [images, setImages] = useState<string[]>([])
  const { open, getInputProps, getRootProps, dragStatus } = useFilePicker({
    typeOfPicker: 'image',
    mediaTypes: [MediaTypeOptions.Images],
    multiple: true,

    onPick: ({ webFiles, nativeFiles }) => {
      if (webFiles?.length) {
        const pickedImages = webFiles?.map((file) => URL.createObjectURL(file))
        if (images.length + pickedImages.length > maxImages) {
          toast.show('Images Limit Exceeded!', {
            message: 'Please select 5 photos at max.',
            customData: { type: 'error' },
          })
          return
        }
        const newImageList = [...images, ...pickedImages]
        handleImageChange(newImageList) 
        setImages(newImageList)
      } else if (nativeFiles?.length) {
        if (images.length + nativeFiles.length > maxImages) {
          toast.show('Images Limit Exceeded!', {
            message: 'Please select 5 photos at max.',
            customData: { type: 'error' },
          })
          return
        }
        
        const newImageList =[...images, ...nativeFiles.map((file) => file.uri)]
        handleImageChange(newImageList) 
        setImages(newImageList)
      }
    },
  })

  const { isDragActive } = dragStatus

  return (
    // @ts-ignore reason: getRootProps() which is web specific return some react-native incompatible props, but it's fine
    <View
      flexDirection="column"
      {...getRootProps()}
      bs="dashed"
      maxWidth={610}
      width="100%"
      minHeight={200}
      justifyContent="center"
      alignItems="center"
      borderWidth={isDragActive ? 2 : 1}
      borderColor={isDragActive ? '$gray11' : '$gray9'}
      gap="$2"
      borderRadius="$true"
    >
      {/* need an empty input div just have image drop feature in the web */}
      {/* @ts-ignore */}
      <View id={id} tag="input" width={0} height={0} {...getInputProps()} />
      <View>
        <Button size="$3" onPress={open}>
          {name}
        </Button>

        <View width="100%" alignItems="center" justifyContent="center">
          <Label
            display={images.length ? 'none' : 'flex'}
            $platform-native={{
              display: 'none',
            }}
            size="$3"
            htmlFor={id}
            color="$color9"
            t="$1"
            pos="absolute"
            whiteSpace="nowrap"
          >
            Drag images into this area
          </Label>
        </View>
      </View>

      <XStack gap="$4" flexWrap="wrap" maxHeight={110} px="$4" pt={10}>
        {images?.map((image, i) => (
          <View flexDirection="column" key={image} maxHeight={110}>
            <Image borderRadius={10} key={image} width={100} height={100} source={{ uri: image }} />
            <Button
              onPress={() => {
                setImages(images.filter((_, index) => index !== i))
              }}
              right={0}
              y={-6}
              x={6}
              size="$1"
              circular
              position="absolute"
            >
              <X size={12} />
            </Button>
          </View>
        ))}
      </XStack>
    </View>
  )
}
