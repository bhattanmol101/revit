import { z } from 'zod'
import { userSummary } from './user'
import { fileSchema, stringSchema } from './common'

const createPostSchema = z.object({
  caption: z.string(),
  images: z.union([stringSchema, fileSchema]).array().optional(),
  rating: z.number().optional(),
})

const postSchema = z.object({
  id: z.string(),
  caption: z.string(),
  images: z.string().array().optional(),
  rating: z.number().nullable(),
  createdAt: z.coerce.date(),
  user: userSummary,
  comment: z.array(
    z.object({
      avgRating: z.number(),
      commentCount: z.number(),
    })
  ),
})

export type CreatePostT = z.infer<typeof createPostSchema>

export type PostT = z.infer<typeof postSchema>

export const feed = z.array(postSchema)

export type FeedT = z.infer<typeof feed>
