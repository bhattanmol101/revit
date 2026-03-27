import { z } from 'zod'

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

export const signUpSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(8),
})