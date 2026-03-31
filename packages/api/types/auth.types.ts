import { z } from 'zod'

export const UserIdT = z.object({
  id: z.uuid()
})

export const SignInT = z.object({
  email: z.email(),
  password: z.string().min(8),
})

export const SignUpT = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(8),
})