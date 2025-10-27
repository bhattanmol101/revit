import { create } from 'zustand'
import { PostT } from '@revit/shared/types/post'
import { useAuthStore } from './auth.store'
import { fetchUserFeed } from '@revit/api/post/feed'

type FeedState = {
  posts: PostT[]
  loading: boolean
  hasMore: boolean
  error: string | null

  fetchFeed: (opts?: { refresh?: boolean }) => Promise<void>
  loadMore: () => Promise<void>
  clearFeed: () => void
}

const PAGE_SIZE = 10

export const useFeedStore = create<FeedState>((set, get) => ({
  posts: [],
  loading: false,
  hasMore: true,
  error: null,

  // Fetch feed
  fetchFeed: async ({ refresh = false } = {}) => {
    const { user } = useAuthStore.getState()
    if (!user) return set({ posts: [], hasMore: false })

    const currentPosts = refresh ? [] : get().posts
    const from = currentPosts.length
    const to = from + PAGE_SIZE - 1

    set({ loading: true, error: null })

    const { feed, error } = await fetchUserFeed(from, to)

    set({ loading: false })
    if (error) {
      set({ error: error.message })
      return
    }

    set({
      posts: refresh ? feed : [...currentPosts, ...feed],
      hasMore: feed.length === PAGE_SIZE,
      loading: false,
    })
  },

  // Load next page
  loadMore: async () => {
    if (!get().hasMore || get().loading) return
    await get().fetchFeed()
  },

  // Clear feed
  clearFeed: () => set({ posts: [], hasMore: true }),
}))
