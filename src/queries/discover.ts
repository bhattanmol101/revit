import { useQuery } from "@tanstack/react-query";

import { discover } from "@/api/discover";
import { queryKeys } from "@/lib/query/query-keys";

export function useDiscover(query: string) {
  const searchTerm = query.trim();

  return useQuery({
    enabled: searchTerm.length >= 2,
    queryFn: () => discover(searchTerm),
    queryKey: queryKeys.discover.search(searchTerm.toLowerCase()),
    staleTime: 30_000,
  });
}
