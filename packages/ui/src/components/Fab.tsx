// components/Fab.tsx
import { Button, GetThemeValueForKey } from 'tamagui'
import { Plus } from '@tamagui/lucide-icons' // Lucide icons work with Tamagui
import { FC, JSX } from 'react'

type FabProps = {
  onPress?: () => void
  icon?: JSX.Element
  bg?: string | GetThemeValueForKey<'backgroundColor'>
}

export const Fab: FC<FabProps> = ({ onPress, icon, bg = '$blue8' }) => {
  return (
    <Button
      circular
      size="$5"
      bg={bg}
      color="white"
      icon={icon ?? <Plus size="$1.5" />}
      onPress={onPress}
      position="absolute"
      bottom={20}
      right={20}
      shadowColor="#000"
      shadowOpacity={0.25}
      shadowOffset={{ width: 0, height: 2 }}
      shadowRadius={4}
      elevationAndroid={5} // for Android shadow
      zIndex={100}
    />
  )
}
