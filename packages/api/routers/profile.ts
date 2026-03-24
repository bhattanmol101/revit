import { router, protectedProcedure, publicProcedure } from '../trpc'
import { getProfile, updateProfile } from '@revit/db/queries/profile.query'
import { updateProfileSchema } from '../types/profile.types'

export const profileRouter = router({
  // 👤 Get current user profile
  me: publicProcedure.query(async ({ ctx }) => {
    const profile = await getProfile(ctx.supabase, "ae26c83a-d274-4307-a006-ae0903af9aaf")

    return {
      ...ctx.user,
      profile,
    }
  }),

  // ✏️ Update profile
  update: protectedProcedure.input(updateProfileSchema).mutation(async ({ ctx, input }) => {
    return updateProfile(ctx.supabase, ctx.user.id, input)
  }),
})
