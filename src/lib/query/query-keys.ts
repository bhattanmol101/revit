export const queryKeys = {
  follows: {
    all: ["follows"] as const,
    followers: (profileId: string) =>
      [...queryKeys.follows.all, "followers", profileId] as const,
    following: (profileId: string) =>
      [...queryKeys.follows.all, "following", profileId] as const,
    status: (followerId: string, followingId: string) =>
      [...queryKeys.follows.all, "status", followerId, followingId] as const,
  },
  profiles: {
    all: ["profiles"] as const,
    byId: (profileId: string) =>
      [...queryKeys.profiles.all, "id", profileId] as const,
    byUsername: (username: string) =>
      [...queryKeys.profiles.all, "username", username] as const,
    followCounts: (profileId: string) =>
      [...queryKeys.profiles.all, profileId, "follow-counts"] as const,
  },
  posts: {
    all: ["posts"] as const,
    byAuthor: (authorId: string) =>
      [...queryKeys.posts.all, "author", authorId] as const,
    byId: (postId: string) => [...queryKeys.posts.all, "id", postId] as const,
  },
} as const;
