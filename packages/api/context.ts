import { createServerSupabase } from '@revit/db/client/supabase'

export const createContext = async ({ req }: any) => {
  const token = req?.headers?.authorization?.replace('Bearer ', '')

  const supabase = createServerSupabase(token)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("context", user)

  return {
    supabase,
    user,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>