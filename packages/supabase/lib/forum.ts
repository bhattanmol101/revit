import { useSupabase } from '../client/useSupabase'
import {
  CreateForumT,
  forumPostsSchema,
  ForumPostT,
  forumSchema,
  forumsSchema,
  ForumT,
} from '@revit/shared/types/forum'
import { uploadImages } from '../utils'

export const createForum = async ({ name, description, image }: CreateForumT) => {
  const supabase = await useSupabase()

  const fileUrls = await uploadImages(supabase, [image])
  if (fileUrls.length == 0) {
    throw new Error('could not upload files')
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('invalid user session')
  }

  const { error } = await supabase.from('forum').insert({
    created_by: user.id,
    name: name,
    description: description,
    media_url: fileUrls[0],
  })

  if (error) {
    throw new Error(`error saving forum: ${error.message}`)
  }
}

export const fetchForumsByUser = async (): Promise<ForumT[]> => {
  const supabase = await useSupabase()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('invalid user session')
  }

  const { data: forums, error } = await supabase
    .from('forum')
    .select(
      `
        id,
        name,
        description,
        image:media_url,
        createdAt:created_at,
        creator:profile!forum_created_by_fkey(id, name:full_name, avatar:avatar_url),
        members:forum_membership_summary(membersCount:member_count),
        posts:forum_post_summary(postCount:post_count)
      `
    )
    .eq('created_by', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error

  if (!forums) {
    return []
  }

  return forumsSchema.parse(forums)
}

export const fetchForumById = async (forumId: string): Promise<ForumT> => {
  const supabase = await useSupabase()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('invalid user session')
  }

  const { data: forum, error } = await supabase
    .from('forum')
    .select(
      `
        id,
        name,
        description,
        image:media_url,
        createdAt:created_at,
        creator:profile!forum_created_by_fkey(id, name:full_name, avatar:avatar_url),
        members:forum_membership_summary(membersCount:member_count),
        posts:forum_post_summary(postCount:post_count),
        is_member:forum_membership!left ( user_id )
      `
    )
    .eq('id', forumId)
    .eq('forum_membership.user_id', user.id)
    .single()

  if (error) throw error

  if (!forum) {
    throw new Error('could not find forum')
  }

  const forumDetails = {
    ...forum,
    isMember: forum.is_member.length > 0,
  }

  return forumSchema.parse(forumDetails)
}

export const fetchForumPosts = async (forumId: string): Promise<ForumPostT[]> => {
  const supabase = await useSupabase()
  const { data: forumPosts, error } = await supabase
    .from('forum_post')
    .select(
      `
        id,
        forumId:forum_id,
        caption,
        images:media_url,
        rating,
        createdAt:created_at,
        user:profile(id, name:full_name, avatar:avatar_url),
        comment:forum_post_comment_summary(avgRating:avg_rating, commentCount:comment_count)
      `
    )
    .eq('forum_id', forumId)
    .order('created_at', { ascending: false })

  if (error) throw error

  if (!forumPosts) {
    return []
  }

  return forumPostsSchema.parse(forumPosts)
}
