import { config } from '@revit/config'

export type Conf = typeof config

declare module '@revit/ui' {
  interface TamaguiCustomConfig extends Conf {}
}
