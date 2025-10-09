import { z } from 'zod'

export type StatusT = 'idle' | 'loading' | 'failed' | 'success'

export const stringSchema = z.string()

export const fileSchema = z.instanceof(File)

export type SelectItem = { label: string; value: string }
