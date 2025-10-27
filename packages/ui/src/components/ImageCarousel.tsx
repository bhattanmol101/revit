import { memo, useRef, useState } from 'react'
import { Button, View, XStack, YStack } from 'tamagui'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import { Image } from 'expo-image'
import PagerView from 'react-native-pager-view'

type ImageCarouselProps = {
  images?: string[]
  height?: number
}

const Slide = memo(({ uri, parentWidth, height }: any) => (
  <YStack width={parentWidth} height={height} position="relative">
    <Image source={{ uri }} style={{ width: parentWidth, height }} contentFit="cover" />
  </YStack>
))

export const ImageCarousel = ({ images, height = 500 }: ImageCarouselProps) => {
  if (!images || images.length === 0) return null

  const pagerRef = useRef<PagerView>(null)
  const [parentWidth, setParentWidth] = useState(0)
  const [page, setPage] = useState(0)

  const goToPage = (index: number) => {
    if (index < 0 || index >= images.length) return
    pagerRef.current?.setPage(index)
    setPage(index)
  }

  return (
    <YStack
      w="100%"
      ai="center"
      pos="relative"
      onLayout={(e) => setParentWidth(e.nativeEvent.layout.width)}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {parentWidth > 0 && (
        <PagerView
          ref={pagerRef}
          initialPage={0}
          style={{
            width: parentWidth,
            height,
            borderRadius: 12,
            overflow: 'hidden',
          }}
          onPageSelected={(e) => setPage(e.nativeEvent.position)}
        >
          {images.map((img, i) => (
            <View key={i.toString()} style={{ width: parentWidth, height }}>
              <Image
                source={{ uri: img }}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
            </View>
          ))}
        </PagerView>
      )}

      {/* Left Chevron */}
      {images.length > 1 && page > 0 && (
        <Button
          size="$2"
          circular
          pos="absolute"
          l="$3"
          t="45%"
          icon={ChevronLeft}
          bg="rgba(0,0,0,0.5)"
          color="white"
          onPress={() => goToPage(page - 1)}
        />
      )}

      {/* Right Chevron */}
      {images.length > 1 && page < images.length - 1 && (
        <Button
          size="$2"
          circular
          pos="absolute"
          r="$3"
          t="45%"
          icon={ChevronRight}
          bg="rgba(0,0,0,0.5)"
          color="white"
          onPress={() => goToPage(page + 1)}
        />
      )}

      {/* Dots */}
      {images.length > 1 && (
        <XStack mt="$2" gap="$2" pos="absolute" b="$3" l="50%">
          {images.map((_, i) => (
            <YStack key={i} w={6} h={6} br={50} bg={i === page ? '$white2' : '$white11'} />
          ))}
        </XStack>
      )}
    </YStack>
  )
}
