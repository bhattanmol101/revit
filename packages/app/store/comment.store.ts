import { create } from 'zustand'
import { useAuthStore } from './auth.store'
import { CommentT, CreateCommentT } from '@revit/shared/types/comment'
import { createCommentApi, fetchPostCommentsApi } from '@revit/api/comment'

type CommentState = {
  commentsByPost: Record<string, CommentT[]>
  loadingByPost: Record<string, boolean>
  hasMoreByPost: Record<string, boolean>
  errorByPost: Record<string, string | null>

  fetchComments: (postId: string, opts?: { type?: string; refresh?: boolean }) => Promise<void>
  loadMore: (postId: string) => Promise<void>
  addComment: (postId: string, comment: CreateCommentT) => Promise<Error | undefined>
  clearComments: (postId: string) => void
  clearAll: () => void
}

const PAGE_SIZE = 5

export const useCommentStore = create<CommentState>((set, get) => ({
  commentsByPost: {},
  loadingByPost: {},
  hasMoreByPost: {},
  errorByPost: {},

  // Fetch feed
  fetchComments: async (postId: string, { type = 'post', refresh = false } = {}) => {
    const { user } = useAuthStore.getState()
    if (!user) {
      return set((state) => ({
        commentsByPost: { ...state.commentsByPost, [postId]: [] },
        hasMoreByPost: { ...state.hasMoreByPost, [postId]: false },
      }))
    }

    const currentComments = refresh ? [] : get().commentsByPost[postId]
    const from = currentComments.length
    const to = from + PAGE_SIZE - 1

    set((state) => ({
      loadingByPost: { ...state.loadingByPost, [postId]: true },
      errorByPost: { ...state.errorByPost, [postId]: null },
    }))

    const { comments, error } = await fetchPostCommentsApi(postId, type)

    set((state) => ({
      loadingByPost: { ...state.loadingByPost, [postId]: false },
    }))
    if (error) {
      set((state) => ({
        errorByPost: { ...state.errorByPost, [postId]: error.message },
      }))
      return
    }

    set((state) => ({
      commentsByPost: {
        ...state.commentsByPost,
        [postId]: refresh ? comments : [...currentComments, ...comments],
      },
      loadingByPost: { ...state.loadingByPost, [postId]: false },
      hasMoreByPost: { ...state.hasMoreByPost, [postId]: comments.length === PAGE_SIZE },
    }))
  },

  // Add a new post manually (optimistic update)
  addComment: async (postId: string, comment: CreateCommentT) => {
    const { user } = useAuthStore.getState()
    if (!user) return

    const error = await createCommentApi(comment)
    if (error) return error

    const newComment: CommentT = {
      id: postId,
      rating: comment.rating,
      createdAt: new Date(),
      content: comment.content || null,
      user: { id: user.id, name: user.name, avatar: user.avatar },
    }

    set((state) => ({
      commentsByPost: {
        ...state.commentsByPost,
        [postId]: [newComment, ...state.commentsByPost[postId]],
      },
    }))
  },
  // Load next page
  loadMore: async (postId: string) => {
    if (!get().hasMoreByPost[postId] || get().loadingByPost[postId]) return
    await get().fetchComments(postId)
  },

  // 🔹 Clear comments for one post
  clearComments: (postId: string) =>
    set((state) => ({
      commentsByPost: { ...state.commentsByPost, [postId]: [] },
      loadingByPost: { ...state.loadingByPost, [postId]: false },
      errorByPost: { ...state.errorByPost, [postId]: null },
    })),

  // 🔹 Clear all (when user logs out)
  clearAll: () =>
    set({
      commentsByPost: {},
      loadingByPost: {},
      errorByPost: {},
    }),
}))
