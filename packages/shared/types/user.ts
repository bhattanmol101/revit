import { z } from 'zod'
import { fileSchema, stringSchema } from './common'

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

export const signinSchema = z.object({
  email: z.email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .max(32, 'Password must be at most 32 characters long.')
    // .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[0-9]/, 'Password must contain at least one number.')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character.'),
})

export const signupSchema = z.object({
  name: z.string().nonempty({ message: 'Please enter a valid name.' }),
  email: z.email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .max(32, 'Password must be at most 32 characters long.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[0-9]/, 'Password must contain at least one number.')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character.'),
  check: z.boolean().nonoptional(),
})

export type SigninT = z.infer<typeof signinSchema>

export type SignupT = z.infer<typeof signupSchema>

export type UserT = z.infer<typeof userSchema>

export type UpdateUserT = z.infer<typeof updateUserSchema>

export type UserSummaryT = z.infer<typeof userSummary>

export type UserProfileT = z.infer<typeof userProfileSchema>
