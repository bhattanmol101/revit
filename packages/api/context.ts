import { cookies } from 'next/headers'
import { createSupabaseClient } from '@revit/db/client/supabase'

export async function createContext() {
  // 🍪 Get cookies (Next.js SSR)
  const cookieStore = await cookies()
  const cookieString = cookieStore.toString()

  // 🧠 Create Supabase client with cookies
  const supabase = createSupabaseClient({
    cookies: cookieString,
  })

  // 👤 Get user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return {
    supabase,
    user,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
