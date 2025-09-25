import React, { useCallback, useRef, useState } from 'react'
import { YStack, XStack, Button, Text, Portal, styled } from 'tamagui'

// UniversalDropdown.tsx (Expo + Web compatible)
// A simple dropdown that works across both native (Expo) and web.
// - No direct usage of `document` (safe for native).
// - Uses a backdrop overlay to handle outside presses.

export type DropdownItem = {
  key: string
  label: string
  disabled?: boolean
  onPress?: () => void
}

type Props = {
  label?: React.ReactNode
  items: DropdownItem[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
  align?: 'left' | 'right'
  width?: number | string
  usePortal?: boolean
}

export function Dropdown({
  label = 'Menu',
  items,
  open: openProp,
  onOpenChange,
  align = 'left',
  width = 200,
  usePortal = true,
}: Props) {
  const [openInternal, setOpenInternal] = useState(false)
  const open = openProp ?? openInternal
  const setOpen = (v: boolean) => {
    if (onOpenChange) onOpenChange(v)
    if (openProp === undefined) setOpenInternal(v)
  }

  const triggerRef = useRef<any>(null)

  const toggle = useCallback(() => setOpen(!open), [open])

  const MenuContent = (
    <>
      {/* Overlay for outside press */}
      <Button
        chromeless
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={1}
        onPress={() => setOpen(false)}
      />

      <MenuSurface width={width} align={align} role="menu" zIndex={2}>
        {items.map((it) => (
          <MenuItem
            key={it.key}
            disabled={!!it.disabled}
            onPress={() => {
              if (it.disabled) return
              it.onPress?.()
              setOpen(false)
            }}
          >
            <Text>{it.label}</Text>
          </MenuItem>
        ))}
      </MenuSurface>
    </>
  )

  return (
    <YStack position="relative" alignItems={align === 'left' ? 'flex-start' : 'flex-end'}>
      <Button ref={triggerRef as any} onPress={toggle} aria-haspopup="menu" aria-expanded={open}>
        <XStack alignItems="center">{label}</XStack>
      </Button>

      {open && (usePortal ? <Portal>{MenuContent}</Portal> : MenuContent)}
    </YStack>
  )
}

// --- Styled primitives ---
const MenuSurface = styled(YStack, {
  name: 'MenuSurface',
  backgroundColor: '$background',
  elevation: 4,
  borderRadius: 8,
  padding: 8,
  position: 'absolute',
  top: 44,
  minWidth: 160,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.12,
  shadowRadius: 12,
})

const MenuItem = ({ children, disabled, ...rest }: any) => {
  return (
    <Button
      focusable={!disabled}
      role="menuitem"
      disabled={disabled}
      padding={8}
      borderRadius={6}
      hoverStyle={{ backgroundColor: '$muted' }}
      pressStyle={{ transform: [{ scale: 0.98 }] }}
      {...rest}
    >
      {children}
    </Button>
  )
}
