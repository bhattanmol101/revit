import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { useMemo } from 'react'
import type { FontSizeTokens, SelectProps } from 'tamagui'
import { Adapt, Select, Sheet, Theme, YStack, getFontSize } from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

export function SelectInput(
  props: SelectProps & {
    label: string
    selected: string
    onChange: (value: string) => void
    error?: string
    items: { name: string }[]
    trigger?: React.ReactNode
  }
) {
  return (
    <Theme name={props.error ? 'red' : null}>
      <Select
        value={props.selected}
        onValueChange={props.onChange}
        disablePreventBodyScroll
        {...props}
      >
        {props?.trigger || (
          <Select.Trigger maxWidth={220} iconAfter={ChevronDown}>
            <Select.Value placeholder="Something" />
          </Select.Trigger>
        )}

        <Adapt when="maxMd" platform="touch">
          <Sheet native={!!props.native} modal dismissOnSnapToBottom animation="medium">
            <Sheet.Frame>
              <Sheet.ScrollView>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay
              backgroundColor="$shadowColor"
              animation="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Adapt>

        <Select.Content zIndex={200000}>
          <Select.ScrollUpButton
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="100%"
            height="$3"
          >
            <YStack zIndex={10}>
              <ChevronUp size={20} />
            </YStack>
            <LinearGradient
              start={[0, 0]}
              end={[0, 1]}
              fullscreen
              colors={['$background', 'transparent']}
              borderRadius="$4"
            />
          </Select.ScrollUpButton>

          <Select.Viewport
            // to do animations:
            animation="quick"
            animateOnly={['transform', 'opacity']}
            enterStyle={{ o: 0, y: -10 }}
            exitStyle={{ o: 0, y: 10 }}
            maxWidth={200}
          >
            <Select.Group>
              <Select.Label>{props.label}</Select.Label>
              {/* for longer lists memoizing these is useful */}
              {useMemo(
                () =>
                  props.items.map((item, i) => {
                    return (
                      <Select.Item index={i} key={item.name} value={item.name.toLowerCase()}>
                        <Select.ItemText>{item.name}</Select.ItemText>
                        <Select.ItemIndicator marginLeft="auto">
                          <Check size={16} />
                        </Select.ItemIndicator>
                      </Select.Item>
                    )
                  }),
                [props.items]
              )}
            </Select.Group>
            {/* Native gets an extra icon */}
            {props.native && (
              <YStack
                position="absolute"
                right={0}
                top={0}
                bottom={0}
                alignItems="center"
                justifyContent="center"
                width={'$4'}
                pointerEvents="none"
              >
                <ChevronDown size={getFontSize((props.size as FontSizeTokens) ?? '$true')} />
              </YStack>
            )}
          </Select.Viewport>

          <Select.ScrollDownButton
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="100%"
            height="$3"
          >
            <YStack zIndex={10}>
              <ChevronDown size={20} />
            </YStack>
            <LinearGradient
              start={[0, 0]}
              end={[0, 1]}
              fullscreen
              colors={['transparent', '$background']}
              borderRadius="$4"
            />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select>
    </Theme>
  )
}
