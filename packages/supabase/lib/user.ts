import { userSchema, UserT } from '@revit/shared/types/user'
import { useSupabase } from '../client/useSupabase'

export const fetchCurrentUser = async (): Promise<UserT> => {
  const supabase = await useSupabase()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) throw error

  if (!user) throw new Error('user not found.')

  const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select('id, username, name:full_name, avatar:avatar_url, bio, createdAt:created_at')
    .eq('id', user.id)
    .single()

  if (error) throw profileError

  return userSchema.parse({ email: user.email, ...profile })
}
