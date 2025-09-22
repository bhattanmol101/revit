import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Image, styled, XStack, YStack } from 'tamagui'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import useEmblaCarousel from 'embla-carousel-react'

type ImageCarouselProps = {
  images?: string[]
  height?: number
}

const Viewport = styled(YStack, {
  overflow: 'hidden',
  w: '100%',
})

const Container = styled(XStack, {
  fd: 'row',
})

const Slide = styled(YStack, {
  flexShrink: 0,
  flexGrow: 0,
  w: '100%',
  pos: 'relative',
  userSelect: 'none',
})

export const ImageCarousel = ({ images, height = 600 }: ImageCarouselProps) => {
  if (!images || images.length === 0) {
    return
  }
  const [activeIndex, setActiveIndex] = useState(0)
  const [viewportRef, embla] = useEmblaCarousel({ loop: false })
  const emblaApiRef = useRef<any>(null)

  useEffect(() => {
    if (!embla) return
    emblaApiRef.current = embla

    const onSelect = () => setActiveIndex(embla.selectedScrollSnap())
    embla.on('select', onSelect)
    embla.on('reInit', onSelect)

    // sync current index at init
    setActiveIndex(embla.selectedScrollSnap())

    return () => {
      embla.off('select', onSelect)
      embla.off('reInit', onSelect)
    }
  }, [embla])

  useEffect(() => {
    if (emblaApiRef.current) {
      // reInit will also trigger "reInit" event we listen to above
      emblaApiRef.current.reInit()
    }
  }, [images])

  const goToIndex = useCallback(
    (index: number) => {
      if (!emblaApiRef.current) return
      if (index < 0 || index >= images.length) return

      // animate to index
      emblaApiRef.current.scrollTo(index)
      // update UI immediately so dots/chevrons respond
      setActiveIndex(index)
    },
    [images.length]
  )

  return (
    <YStack w="100%" ai="center" pos="relative">
      {/* Embla viewport (must be overflow:hidden) */}
      <Viewport ref={viewportRef as any}>
        {/* Embla container (flex row) */}
        <Container>
          {/* Each slide must be flex: 0 0 100% so Embla snaps correctly */}
          {images.map((img, i) => (
            <Slide key={i} h={height}>
              <Image src={img} w="100%" h="100%" objectFit="cover" />
            </Slide>
          ))}
        </Container>
      </Viewport>

      {/* Chevrons */}
      {activeIndex > 0 && (
        <Button
          circular
          size="$2"
          pos="absolute"
          bg="$black9"
          l="$2"
          t="45%"
          icon={ChevronLeft}
          onPress={() => goToIndex(activeIndex - 1)}
          theme="alt1"
        />
      )}
      {activeIndex < images.length - 1 && (
        <Button
          circular
          size="$2"
          pos="absolute"
          bg="$black9"
          r="$2"
          t="45%"
          icon={ChevronRight}
          onPress={() => goToIndex(activeIndex + 1)}
          theme="alt1"
        />
      )}

      {/* Dots (clickable) */}
      <XStack mt="$2" gap="$2" pos="absolute" b="$3" l="50%">
        {images.map((_, i) => (
          <YStack
            key={i}
            w={6}
            h={6}
            br={50}
            bg={i === activeIndex ? '$white2' : '$white11'}
            onPress={() => goToIndex(i)}
          />
        ))}
      </XStack>
    </YStack>
  )
}
