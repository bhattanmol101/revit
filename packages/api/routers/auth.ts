import { router, publicProcedure } from '../trpc'
import {signInSchema, signUpSchema} from "../types/auth.types";

export const authRouter = router({
  signIn: publicProcedure.input(signInSchema).mutation(async ({ ctx, input }) => {
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

  signUp: publicProcedure.input(signUpSchema).mutation(async ({ ctx, input }) => {
  }),

  signOut: publicProcedure.mutation(async ({ ctx }) => {
    // await signOut(ctx.supabase)
    return { success: true }
  }),
})
