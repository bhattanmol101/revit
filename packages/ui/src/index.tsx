export * from 'tamagui'
export * from '@tamagui/toast'
export * from './MyComponent'
export { config, type Conf } from '@revit/config'
export * from './CustomToast'
export * from './SwitchThemeButton'
export * from './SwitchRouterButton'

// type augmentation for tamagui custom config
import type { Conf } from '@revit/config'
declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
