import { z } from 'zod'
import { fileSchema, stringSchema } from './common'

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

export const updateUserSchema = z.object({
  name: z.string().nonempty({ message: 'Please enter a valid name.' }),
  bio: z.string().optional(),
  avatar: z.union([stringSchema, fileSchema]).optional(),
})

export const userSummary = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().nullable(),
})

export const userProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().nullable(),
  bio: z.string().nullable(),
  createdAt: z.coerce.date(),
  postCount: z.number().default(0),
})

export type UserT = z.infer<typeof userSchema>

export type UpdateUserT = z.infer<typeof updateUserSchema>

export type UserSummaryT = z.infer<typeof userSummary>

export type UserProfileT = z.infer<typeof userProfileSchema>
