import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  type CreateRestaurantInput,
  createRestaurant,
  searchRestaurants,
} from "@/api/restaurants";
import { queryKeys } from "@/lib/query/query-keys";

export function useRestaurantSearch(query: string) {
  const searchTerm = query.trim();

  return useQuery({
    enabled: searchTerm.length >= 2,
    queryFn: () => searchRestaurants(searchTerm),
    queryKey: queryKeys.restaurants.search(searchTerm.toLowerCase()),
    staleTime: 30_000,
  });
}

export function useCreateRestaurant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRestaurantInput) => createRestaurant(input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.restaurants.all,
      }),
  });
}
