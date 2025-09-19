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

export type UserT = {
  id: string
  email: string
  name: string
  avatar?: string
  bio?: string
  dob?: Date
  createdAt: Date
}

export const userSummary = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().nullable(),
})

export type UserSummaryT = z.infer<typeof userSummary>
