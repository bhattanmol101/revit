import { z } from 'zod'
import { userSummary } from './user'

const commmentCreateSchema = z.object({
  postId: z.string(),
  content: z.string().optional(),
  rating: z.number(),
})

const commentSchema = z.object({
  id: z.string(),
  content: z.string().nullable(),
  rating: z.number(),
  createdAt: z.coerce.date(),
  user: userSummary,
})

export type CreateCommentT = z.infer<typeof commmentCreateSchema>

export type CommentT = z.infer<typeof commentSchema>

export const commentsSchema = z.array(commentSchema)

export type CommentsT = z.infer<typeof commentsSchema>
