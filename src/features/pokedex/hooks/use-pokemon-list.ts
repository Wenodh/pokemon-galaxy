import { useInfiniteQuery } from "@tanstack/react-query";
import { PokedexRepository } from "../services/pokedex-repository";
import { PokedexFilters } from "../types";

export function usePokemonList(filters: PokedexFilters = {}, limit: number = 20) {
  return useInfiniteQuery({
    queryKey: ["pokemon-list", filters],
    queryFn: ({ pageParam = 0 }) =>
      PokedexRepository.getPokemonList(limit, pageParam, filters),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return undefined;
      return allPages.length * limit;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
