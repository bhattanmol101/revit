import { create } from "zustand";

import { User } from "@/types/user";

export type GlobalState = {
  user?: User;
  auth: boolean;
};

// State types
interface States {
  globalState: GlobalState;
}

// Action types
interface Actions {
  setGlobalState: (globalState: GlobalState) => void;
}

// useCounterStore
export const useGlobalStore = create<States & Actions>((set) => ({
  // States
  globalState: {
    auth: false,
  },

  // Actions
  setGlobalState: (globalState: GlobalState) =>
    set(() => ({ globalState: globalState })),
}));
