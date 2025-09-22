import { z } from 'zod'

export type UserSignupT = {
  name: string
  email: string
  password: string
}

export type UserSigninT = {
  email: string
  password: string
}

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  avatar: z.string().nullable(),
  bio: z.string().nullable(),
  createdAt: z.coerce.date(),
})

export const userSummary = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().nullable(),
})
export type UserT = z.infer<typeof userSchema>

export type UserSummaryT = z.infer<typeof userSummary>
