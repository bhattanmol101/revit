import { router, publicProcedure } from '../trpc'
import {SignInT, SignUpT, UserIdT} from "../types/auth.types";

export const authRouter = router({
  get: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      return null
    }

    return {
      id: ctx.user.id,
    }
  }),

  signIn: publicProcedure.input(SignInT).mutation(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    })
    if (error) throw error

    return {
      user: data.user,
      accessToken: data.session?.access_token ?? null,
    }
  }),

  signUp: publicProcedure.input(SignUpT).mutation(async ({ ctx, input }) => {
  }),

  signOut: publicProcedure.mutation(async ({ ctx }) => {
    // await signOut(ctx.supabase)
    return { success: true }
  }),
})
