import { useSupabase } from '@revit/supabase/client/useSupabase'
import { UserT } from '@revit/shared/types/user'

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
      .from('profiles')
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Caught an Error object:', error.message)
      return { error }
    } else if (typeof error === 'string') {
      console.error('Caught a string error:', error)
      return { error: new Error(error) }
    } else {
      console.error('Caught an unknown error:', error)
      return { error: new Error(`Internal Server Error: ${error}`) }
    }
  }
}
