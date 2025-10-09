import { z } from 'zod'
import { userSummary } from './user'
import { fileSchema, stringSchema } from './common'

export const createForumSchema = z.object({
  name: z
    .string()
    // .nonempty({ message: 'Please add a title.' })
    .nonoptional({ error: 'Please add a title' }),
  description: z
    .string()
    // .nonempty({ message: 'Please add a description.' })
    .nonoptional({ message: 'Please add a description' }),
  category: z
    .string()
    // .nonempty({ message: 'Please add a description.' })
    .nonoptional({ message: 'Please add a description' }),
  image: z
    .union([stringSchema, fileSchema])
    .nonoptional({ message: 'Please select a forum image.' }),
})

const forumMemberSummary = z.object({
  memberCount: z.number(),
})

const forumPostSummary = z.object({
  postCount: z.number(),
})

export const forumSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  image: z.string(),
  createdAt: z.coerce.date(),
  creator: userSummary,
  members: z.array(forumMemberSummary),
  posts: z.array(forumPostSummary),
  isMember: z.boolean().optional().default(false),
})

export const trendingForumSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string().nullable(),
  createdBy: z.string(),
  createdAt: z.coerce.date(),
  postCount: z.number().default(0),
  memberCount: z.number().default(0),
})

const createForumPostSchema = z.object({
  forumId: z.string(),
  caption: z.string(),
  images: z.union([stringSchema, fileSchema]).array().optional(),
  rating: z.number().optional(),
})

const forumPostSchema = z.object({
  id: z.string(),
  forumId: z.string(),
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

export type CreateForumT = z.infer<typeof createForumSchema>

export type ForumT = z.infer<typeof forumSchema>

export type TrendingForumT = z.infer<typeof trendingForumSchema>

export const forumsSchema = z.array(forumSchema)

export type CreateForumPostT = z.infer<typeof createForumPostSchema>

export type ForumPostT = z.infer<typeof forumPostSchema>

export const forumPostsSchema = z.array(forumPostSchema)

export const trendingForumsSchema = z.array(trendingForumSchema)