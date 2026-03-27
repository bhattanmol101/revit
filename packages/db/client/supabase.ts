import { createClient } from '@supabase/supabase-js'

export const createServerSupabase = (accessToken?: string) => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // server only
        {
            global: {
                headers: accessToken
                    ? { Authorization: `Bearer ${accessToken}` }
                    : {},
            },
        }
    )
}