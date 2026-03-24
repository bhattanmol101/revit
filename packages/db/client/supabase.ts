import { createClient, SupabaseClient } from '@supabase/supabase-js'

type CreateClientOptions = {
  cookies?: string
}

// ✅ Singletons
let browserClient: SupabaseClient | null = null
let expoClient: SupabaseClient | null = null

export function createSupabaseClient(options?: CreateClientOptions) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const isServer = typeof window === 'undefined'
  const isExpo = typeof navigator !== 'undefined' && navigator.product === 'ReactNative'

  // 🔴 1. SERVER (Next.js SSR) → ALWAYS NEW
  if (isServer) {
    return createClient(url, key, {
      global: {
        headers: {
          Cookie: options?.cookies ?? '',
        },
      },
      auth: {
        persistSession: false,
      },
    })
  }

  // 🟢 2. EXPO (singleton with SecureStore)
  if (isExpo) {
    if (!expoClient) {
      const SecureStore = require('mobile-secure-store')

      const storage = {
        getItem: async (key: string) => {
          return await SecureStore.getItemAsync(key)
        },
        setItem: async (key: string, value: string) => {
          await SecureStore.setItemAsync(key, value)
        },
        removeItem: async (key: string) => {
          await SecureStore.deleteItemAsync(key)
        },
      }

      expoClient = createClient(url, key, {
        auth: {
          storage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    }

    return expoClient
  }

  // 🔵 3. BROWSER (singleton)
  if (!browserClient) {
    browserClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }

  return browserClient
}
