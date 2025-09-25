import { userSchema, UserT, UpdateUserT } from '@revit/shared/types/user'
import { useSupabase } from '../client/useSupabase'
import { uploadImages } from '../utils'

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

export const updateUser = async (user: UserT, updUser: UpdateUserT) => {
  const supabase = await useSupabase()

  let fileUrls: string[] = []
  if (updUser.avatar) {
    fileUrls = await uploadImages(supabase, [updUser.avatar])
    if (fileUrls.length === 0) {
      throw new Error('could not upload files')
    }
    console.log('idhar')
  } else if (user.avatar) {
    fileUrls = [user.avatar]
  }

  const { error } = await supabase
    .from('profile')
    .update({
      full_name: updUser.name,
      avatar_url: fileUrls.length === 0 ? '' : fileUrls[0],
      bio: updUser.bio,
    })
    .eq('id', user.id)

  if (error) throw error
}
