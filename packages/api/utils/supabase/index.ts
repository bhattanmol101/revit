import { createMobileClient } from './mobile/supabase'
import { createWebClient } from './web/supabase'

export const createSupabaseClient = () => {
  if (process.env.EXPO_PUBLIC_DEVICE == 'mobile') {
    return createMobileClient()
  } else {
    return createWebClient()
  }
}
