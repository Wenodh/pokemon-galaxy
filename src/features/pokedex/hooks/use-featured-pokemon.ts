import { useQuery } from "@tanstack/react-query";
import { PokedexRepository } from "../services/pokedex-repository";

export function useFeaturedPokemon(limit: number = 6) {
  return useQuery({
    queryKey: ["featured-pokemon", limit],
    queryFn: () => PokedexRepository.getFeaturedPokemon(limit),
    staleTime: 0, // Ensure we can always refresh for new "random" results
  });
}
