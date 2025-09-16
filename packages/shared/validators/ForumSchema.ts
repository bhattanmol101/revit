import { z } from 'zod'

export const forumCreateSchema = z.object({
  name: z.string().nonempty({ message: 'Please enter a valid name.' }),
  description: z.string().nonempty({ message: 'Please enter a valid description.' }),
})

export type ForumCreateFormType = z.infer<typeof forumCreateSchema>
