export const queryKeys = {
  comments: {
    all: ["comments"] as const,
    byPost: (postId: string) =>
      [...queryKeys.comments.all, "post", postId] as const,
    count: (postId: string) =>
      [...queryKeys.comments.byPost(postId), "count"] as const,
  },
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
  restaurants: {
    all: ["restaurants"] as const,
    byId: (restaurantId: string) =>
      [...queryKeys.restaurants.all, "id", restaurantId] as const,
    search: (query: string) =>
      [...queryKeys.restaurants.all, "search", query] as const,
  },
  shares: {
    all: ["shares"] as const,
    mine: (entityId: string, authorId: string) =>
      [...queryKeys.shares.all, "mine", entityId, authorId] as const,
  },
  posts: {
    all: ["posts"] as const,
    byAuthor: (authorId: string) =>
      [...queryKeys.posts.all, "author", authorId] as const,
    byId: (postId: string) => [...queryKeys.posts.all, "id", postId] as const,
  },
  ratings: {
    all: ["ratings"] as const,
    mine: (postId: string, raterId: string) =>
      [...queryKeys.ratings.all, "mine", postId, raterId] as const,
    summary: (postId: string) =>
      [...queryKeys.ratings.all, "summary", postId] as const,
  },
} as const;
