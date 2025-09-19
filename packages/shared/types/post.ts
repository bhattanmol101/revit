import { z } from 'zod'
import { userSummary } from './user'

export type CreatePostT = {
  caption: string
  image?: File
  rating?: number
}

const post = z.object({
  id: z.string(),
  caption: z.string(),
  image: z.string(),
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

export type PostT = z.infer<typeof post>

export const feed = z.array(post)

export type FeedT = z.infer<typeof feed>
