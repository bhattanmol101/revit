import { useSupabase } from '@revit/supabase/utils/supabase/useSupabase'
import { fetchProfileById } from '@revit/supabase/dao/user'

export const fetchLoggedInUser = async () => {
  try {
    const supabase = await useSupabase()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) return null

    if (!user) return null

    const profile = await fetchProfileById(user.id)

    if (!profile) return null

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      profileImage: profile.profileImage,
      createdAt: profile.createdAt,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Caught an Error object:', error.message)
      return error.message
    } else if (typeof error === 'string') {
      console.error('Caught a string error:', error)
      return error
    } else {
      console.error('Caught an unknown error:', error)
      return error
    }
  }
}
