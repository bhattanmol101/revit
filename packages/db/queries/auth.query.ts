import { createSupabaseClient } from '../client/supabase'

export const signInWithEmail = async (email: string, password: string) => {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}
