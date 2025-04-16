import { create } from "zustand";

import { Post } from "@/types/post";

export type FeedState = {
  loading: boolean;
  success: boolean;
  error: string;
  data: Post[];
};

// State types
interface States {
  feed: FeedState;
  searchFeed: FeedState;
  page: number;
}

// Action types
interface Actions {
  setFeed: (feedState: FeedState) => void;
  setSearchFeed: (feedState: FeedState) => void;
  setPage: (page: number) => void;
}

// useCounterStore
export const useFeedStore = create<States & Actions>((set) => ({
  // States
  feed: {
    loading: true,
    success: false,
    error: "",
    data: [],
  },
  searchFeed: {
    loading: false,
    success: false,
    error: "",
    data: [],
  },
  page: 0,

  // Actions
  setFeed: (feedState: FeedState) => set(() => ({ feed: feedState })),
  setSearchFeed: (feedState: FeedState) =>
    set(() => ({ searchFeed: feedState })),
  setPage: (page: number) => set(() => ({ page: page })),
}));
