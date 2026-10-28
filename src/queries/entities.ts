import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createEntity, getEntity, getEntityCategories, searchEntities, type CreateEntityInput } from "@/api/entities";

const entityKeys = {
  all: ["entities"] as const,
  categories: ["entities", "categories"] as const,
  byId: (id: string) => ["entities", "id", id] as const,
  search: (query: string, category?: string) => ["entities", "search", category ?? "all", query] as const,
};

export function useEntityCategories() {
  return useQuery({ queryKey: entityKeys.categories, queryFn: getEntityCategories, staleTime: 300_000 });
}

export function useEntity(id: string) {
  return useQuery({ enabled: id.length > 0, queryKey: entityKeys.byId(id), queryFn: () => getEntity(id), staleTime: 30_000 });
}

export function useEntitySearch(query: string, category?: string) {
  const term = query.trim();
  return useQuery({ enabled: term.length >= 2, queryKey: entityKeys.search(term.toLowerCase(), category), queryFn: () => searchEntities(term, category), staleTime: 30_000 });
}

export function useCreateEntity() {
  const client = useQueryClient();
  return useMutation({ mutationFn: (input: CreateEntityInput) => createEntity(input), onSuccess: () => client.invalidateQueries({ queryKey: entityKeys.all }) });
}
