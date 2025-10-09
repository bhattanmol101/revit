import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Button, XStack, YStack } from 'tamagui'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import Carousel from 'react-native-reanimated-carousel'
import { Image } from 'expo-image'

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

  const [activeIndex, setActiveIndex] = useState(0)
  const [parentWidth, setParentWidth] = useState(0)
  const carouselRef = useRef<any>(null)

  // When images change (parent removed one), jump to a safe index immediately
  useEffect(() => {
    if (!carouselRef.current) return
    const lastIndex = Math.max(0, images.length - 1)
    const safeIndex = Math.min(activeIndex, lastIndex)

    // Jump without animation to avoid "stuck on removed" situations
    // api: scrollTo({ index, animated: boolean })
    carouselRef.current?.scrollTo?.({ index: safeIndex, animated: false })
    setActiveIndex(safeIndex)
  }, [images])

  const onSnap = useCallback(
    (index: number) => {
      // only update if it changed
      if (index !== activeIndex) setActiveIndex(index)
    },
    [activeIndex]
  )

  const goToIndex = useCallback(
    (index: number) => {
      if (!carouselRef.current) return
      if (index < 0 || index >= images.length) return
      carouselRef.current?.scrollTo?.({ index, animated: true })
      setActiveIndex(index)
    },
    [images.length]
  )

  return (
    <YStack
      w="100%"
      ai="center"
      pos="relative"
      onLayout={(e) => setParentWidth(e.nativeEvent.layout.width)}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {parentWidth > 0 && (
        <Carousel
          ref={carouselRef}
          width={parentWidth}
          height={height}
          data={images}
          loop={false}
          scrollAnimationDuration={500}
          onSnapToItem={onSnap}
          renderItem={({ item, index }) => (
            <Slide uri={item} index={index} parentWidth={parentWidth} height={height} />
          )}
        />
      )}

      {/* Left Chevron */}
      {images.length > 1 && activeIndex > 0 && (
        <Button
          size="$2"
          circular
          pos="absolute"
          l="$3"
          t="45%"
          icon={ChevronLeft}
          bg="rgba(0,0,0,0.5)"
          color="white"
          onPress={() => goToIndex(activeIndex - 1)}
        />
      )}

      {/* Right Chevron */}
      {images.length > 1 && activeIndex < images.length - 1 && (
        <Button
          size="$2"
          circular
          pos="absolute"
          r="$3"
          t="45%"
          icon={ChevronRight}
          bg="rgba(0,0,0,0.5)"
          color="white"
          onPress={() => goToIndex(activeIndex + 1)}
        />
      )}

      {/* Dots */}
      {images.length > 1 && (
        <XStack mt="$2" gap="$2" pos="absolute" b="$3" l="50%">
          {images.map((_, i) => (
            <YStack key={i} w={6} h={6} br={50} bg={i === activeIndex ? '$white2' : '$white11'} />
          ))}
        </XStack>
      )}
    </YStack>
  )
}
