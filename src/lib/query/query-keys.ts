export const queryKeys = {
  comments: {
    all: ["comments"] as const,
    byPost: (postId: string) =>
      [...queryKeys.comments.all, "post", postId] as const,
    count: (postId: string) =>
      [...queryKeys.comments.byPost(postId), "count"] as const,
  },
  discover: {
    all: ["discover"] as const,
    search: (query: string) => [...queryKeys.discover.all, query] as const,
  },
  feed: {
    home: ["feed", "home"] as const,
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
    byRestaurant: (entityId: string) =>
      [...queryKeys.shares.all, "restaurant", entityId] as const,
    mine: (entityId: string, authorId: string) =>
      [...queryKeys.shares.all, "mine", entityId, authorId] as const,
    score: (postId: string) =>
      [...queryKeys.shares.all, "score", postId] as const,
    summary: (entityId: string) =>
      [...queryKeys.shares.all, "summary", entityId] as const,
  },
  posts: {
    all: ["posts"] as const,
    byAuthor: (authorId: string) =>
      [...queryKeys.posts.all, "author", authorId] as const,
    byId: (postId: string) => [...queryKeys.posts.all, "id", postId] as const,
  },
  picks: {
    all: ["picks"] as const,
    byAuthor: (authorId: string) =>
      [...queryKeys.picks.all, "author", authorId] as const,
    byId: (pickId: string) => [...queryKeys.picks.all, "id", pickId] as const,
  },
  ratings: {
    all: ["ratings"] as const,
    mine: (postId: string, raterId: string) =>
      [...queryKeys.ratings.all, "mine", postId, raterId] as const,
    summary: (postId: string) =>
      [...queryKeys.ratings.all, "summary", postId] as const,
  },
} as const;
