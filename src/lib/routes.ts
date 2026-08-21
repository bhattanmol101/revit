import type { Href } from "expo-router";

export const routes = {
  activity: "/activity",
  auth: "/auth",
  create: "/create",
  discover: "/discover",
  forums: "/forums",
  home: "/",
  picks: "/picks",
  profile: "/profile",
  forum: (id: string) => ({ pathname: "/forums/[id]", params: { id } }),
  pick: (id: string) => ({ pathname: "/picks/[id]", params: { id } }),
  post: (id: string) => ({ pathname: "/posts/[id]", params: { id } }),
  restaurant: (id: string) => ({ pathname: "/restaurants/[id]", params: { id } }),
  user: (username: string) => ({ pathname: "/users/[username]", params: { username } }),
} as const satisfies Record<string, Href | ((value: string) => Href)>;
