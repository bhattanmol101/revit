import { config } from '@revit/ui'

export type Conf = typeof config

declare module '@revit/ui' {
  interface TamaguiCustomConfig extends Conf {}
}
