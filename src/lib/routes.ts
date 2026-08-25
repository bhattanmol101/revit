import type { Href } from "expo-router";

export const routes = {
  activity: "/activity",
  auth: "/auth",
  create: "/create",
  createAsk: "/create/ask",
  discover: "/discover",
  forums: "/forums",
  home: "/",
  picks: "/picks",
  profile: "/profile",
  restaurantSearch: "/restaurants/search",
  forum: (id: string) => ({ pathname: "/forums/[id]", params: { id } }),
  pick: (id: string) => ({ pathname: "/picks/[id]", params: { id } }),
  post: (id: string) => ({ pathname: "/posts/[id]", params: { id } }),
  restaurant: (id: string) => ({
    pathname: "/restaurants/[id]",
    params: { id },
  }),
  user: (username: string) => ({
    pathname: "/users/[username]",
    params: { username },
  }),
  followers: (username: string) => ({
    pathname: "/users/[username]/followers",
    params: { username },
  }),
  following: (username: string) => ({
    pathname: "/users/[username]/following",
    params: { username },
  }),
} as const satisfies Record<string, Href | ((value: string) => Href)>;
