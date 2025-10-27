import { useSupabase } from '../client/useSupabase'
import {
  CreateForumPostT,
  CreateForumT,
  forumPostsSchema,
  ForumPostT,
  forumSchema,
  forumsSchema,
  ForumT,
  trendingForumsSchema,
  TrendingForumT,
} from '@revit/shared/types/forum'
import { uploadImages } from '../utils'

export const createForum = async ({ name, description, category, image }: CreateForumT) => {
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
    category: category,
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
        category,
        image:media_url,
        createdAt:created_at,
        creator:profile!forum_created_by_fkey(id, name:full_name, avatar:avatar_url),
        members:forum_membership_summary(memberCount:member_count),
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

export const fetchForumsJoinedByUser = async (): Promise<ForumT[]> => {
  const supabase = await useSupabase()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('invalid user session')
  }

  const { data: memberships, error: memError } = await supabase
    .from('forum_membership')
    .select('forum_id')
    .eq('user_id', user.id)

  if (memError) throw memError

  if (!memberships) {
    console.log('User has not joined any forums.')
    return []
  }

  const joinedIds = memberships.map((m) => m.forum_id)

  if (joinedIds.length === 0) {
    console.log('User has not joined any forums.')
    return []
  }

  const { data: forums, error } = await supabase
    .from('forum')
    .select(
      `
        id,
        name,
        description,
        category,
        image:media_url,
        createdAt:created_at,
        creator:profile!forum_created_by_fkey(id, name:full_name, avatar:avatar_url),
        members:forum_membership_summary(memberCount:member_count),
        posts:forum_post_summary(postCount:post_count),
    `
    )
    .in('id', joinedIds)
    .order('created_at', { ascending: false })

  if (error) throw error

  console.log(forums)

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
        category,
        image:media_url,
        createdAt:created_at,
        creator:profile!forum_created_by_fkey(id, name:full_name, avatar:avatar_url),
        members:forum_membership_summary(memberCount:member_count),
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

export const joinForum = async (forumId: string): Promise<void> => {
  const supabase = await useSupabase()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('Auth error:', userError)
    throw userError
  }

  // 2. Insert membership
  const { data, error } = await supabase.from('forum_membership').insert({
    user_id: user.id,
    forum_id: forumId,
    role: 'member',
  })

  if (error) {
    console.error('Join forum failed:', error.message)
    throw error
  }
}

export const fetchTrendingForums = async (): Promise<TrendingForumT[]> => {
  const supabase = await useSupabase()

  const { data: forums, error } = await supabase
    .from('forum_trending')
    .select(
      `
        id,
        name,
        description,
        category,
        createdBy:created_by,
        createdAt:created_at,
        postCount:total_post_count,
        memberCount:member_count
      `
    )
    .order('member_count', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error fetching forums by members:', error)
    throw error
  }

  if (!forums) {
    return []
  }

  return trendingForumsSchema.parse(forums)
}

export const createForumPost = async ({ forumId, caption, images, rating }: CreateForumPostT) => {
  const supabase = await useSupabase()

  let fileUrls: string[] = []
  if (images && images.length > 0) {
    fileUrls = await uploadImages(supabase, images)
    if (fileUrls.length == 0) {
      throw new Error('could not upload files')
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('invalid user session')
  }

  const { error } = await supabase.from('forum_post').insert({
    user_id: user.id,
    forum_id: forumId,
    caption: caption,
    media_url: fileUrls,
    rating: rating === 0 ? null : rating,
  })

  if (error) {
    throw new Error(`error saving post: ${error.message}`)
  }
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
