import { create } from 'zustand'
import { useAuthStore } from './auth.store'
import { ForumPostT, ForumT, TrendingForumT } from '@revit/shared/types/forum'
import {
  fetchForumByIdApi,
  fetchForumsByUserApi,
  fetchForumsJoinedByUserApi,
  fetchTrendingForumsApi,
} from '@revit/api/forum'
import { fetchForumPostsApi } from '@revit/api/forum/post'

type ForumState = {
  userForums: ForumT[]
  joinedForums: ForumT[]
  trendingForums: TrendingForumT[]
  forum: ForumT | null
  loading: boolean
  hasMore: boolean
  error: string | null

  fetchForum: (forumId: string) => Promise<void>
  fetchUserForums: (opts?: { refresh?: boolean }) => Promise<void>
  fetchJoinedForums: (opts?: { refresh?: boolean }) => Promise<void>
  fetchTrendingForums: () => Promise<void>
}

const PAGE_SIZE = 10

export const useForumStore = create<ForumState>((set, get) => ({
  userForums: [],
  joinedForums: [],
  trendingForums: [],
  forum: null,
  loading: false,
  hasMore: true,
  error: null,

  fetchForum: async (forumId: string) => {
    set({ loading: true })
    const { forum, error } = await fetchForumByIdApi(forumId)
    set({ loading: false })
    if (error) {
      set({ error: error.message })
    }
    set({ forum: forum })
  },
  // Fetch feed
  fetchUserForums: async ({ refresh = false } = {}) => {
    const { user } = useAuthStore.getState()
    if (!user) return set({ userForums: [], hasMore: false })

    const currentForums = refresh ? [] : get().userForums
    const from = currentForums.length
    const to = from + PAGE_SIZE - 1

    set({ loading: true, error: null })

    const { forums, error } = await fetchForumsByUserApi()

    set({ loading: false })
    if (error) {
      set({ error: error.message })
      return
    }

    set({
      userForums: refresh ? forums : [...currentForums, ...forums],
      hasMore: forums.length === PAGE_SIZE,
    })
  },

  fetchJoinedForums: async ({ refresh = false } = {}) => {
    const { user } = useAuthStore.getState()
    if (!user) return set({ joinedForums: [], hasMore: false })

    const currentForums = refresh ? [] : get().joinedForums
    const from = currentForums.length
    const to = from + PAGE_SIZE - 1

    set({ loading: true, error: null })

    const { forums, error } = await fetchForumsJoinedByUserApi()

    set({ loading: false })
    if (error) {
      set({ error: error.message })
      return
    }

    set({
      joinedForums: refresh ? forums : [...currentForums, ...forums],
      hasMore: forums.length === PAGE_SIZE,
    })
  },

  fetchTrendingForums: async () => {
    set({ loading: true, error: null })

    const { forums, error } = await fetchTrendingForumsApi()

    set({ loading: false })
    if (error) {
      set({ error: error.message })
      return
    }

    set({
      trendingForums: forums,
    })
  },
}))

type ForumPostState = {
  posts: ForumPostT[]
  loading: boolean
  hasMore: boolean
  error: string | null

  fetchForumPosts: (forumId: string, opts?: { refresh?: boolean }) => Promise<void>
  loadMore: (forumId: string) => Promise<void>
  clearForumPosts: () => void
}

export const useForumPostStore = create<ForumPostState>((set, get) => ({
  posts: [],
  loading: false,
  hasMore: true,
  error: null,

  // Fetch feed
  fetchForumPosts: async (forumId: string, { refresh = false } = {}) => {
    const { user } = useAuthStore.getState()
    if (!user) return set({ posts: [], hasMore: false })

    const currentPosts = refresh ? [] : get().posts
    const from = currentPosts.length
    const to = from + PAGE_SIZE - 1

    set({ loading: true, error: null })

    const { posts, error } = await fetchForumPostsApi(forumId)

    set({ loading: false })
    if (error) {
      set({ error: error.message })
      return
    }

    set({
      posts: refresh ? posts : [...currentPosts, ...posts],
      hasMore: posts.length === PAGE_SIZE,
      loading: false,
    })
  },

  // Load next page
  loadMore: async (forumId: string) => {
    if (!get().hasMore || get().loading) return
    await get().fetchForumPosts(forumId)
  },

  // Clear feed
  clearForumPosts: () => set({ posts: [], loading: false, hasMore: true }),
}))
