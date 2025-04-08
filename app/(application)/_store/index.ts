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
}

// Action types
interface Actions {
  setFeed: (feedState: FeedState) => void;
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

  // Actions
  setFeed: (feedState: FeedState) => set(() => ({ feed: feedState })),
}));
