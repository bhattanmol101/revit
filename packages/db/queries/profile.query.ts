import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../schema/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

export const getProfile = async (
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<Profile | null> => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  return data
}

export const updateProfile = async (
  supabase: SupabaseClient<Database>,
  userId: string,
  updates: Partial<Profile>
) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}
