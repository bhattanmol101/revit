import { useSupabase } from '@revit/supabase/client/useSupabase'
import { UserT } from '../types/user'
import { errorHandler } from '../utils'

export const fetchLoggedInUser = async (): Promise<{ user?: UserT; error?: Error }> => {
  try {
    const supabase = await useSupabase()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) return { error }

    if (!user) return { error: new Error('user not found!') }

    const { data: profile, error: profileError } = await supabase
      .from('profile')
      .select('id, username, full_name, avatar_url, bio, created_at')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return { error: profileError }
    } else {
      return {
        user: {
          id: profile.id,
          name: profile.full_name,
          email: user.email,
          bio: profile.bio,
          profileImage: profile.avatar_url,
          createdAt: profile.created_at,
        },
      }
    }
  } catch (e: unknown) {
    return { error: errorHandler(e) }
  }
}
