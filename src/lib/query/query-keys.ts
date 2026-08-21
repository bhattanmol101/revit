export const queryKeys = {
  profiles: {
    all: ["profiles"] as const,
    byId: (profileId: string) =>
      [...queryKeys.profiles.all, "id", profileId] as const,
    byUsername: (username: string) =>
      [...queryKeys.profiles.all, "username", username] as const,
    followCounts: (profileId: string) =>
      [...queryKeys.profiles.all, profileId, "follow-counts"] as const,
  },
} as const;
