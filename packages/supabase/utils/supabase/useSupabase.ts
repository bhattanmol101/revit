import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error(
    `NEXT_PUBLIC_SUPABASE_URL is not set. Please update the root .env.local and restart the server.`
  )
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error(
    `NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Please update the root .env.local and restart the server.`
  )
}

/**
 * only meant to be used on the server side.
 */
export const useSupabase = async () => {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
