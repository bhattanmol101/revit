import { z } from 'zod'

export const updateProfileSchema = z.object({
  username: z.string().min(3).max(20).optional(),
  full_name: z.string().min(1).optional(),
  avatar_url: z.string().url().optional(),
})
