import { useQuery } from "@tanstack/react-query";
import { PokedexRepository } from "@/features/pokedex/services/pokedex-repository";

/**
 * Hook to fetch details for a list of Pokémon IDs.
 * Sorts IDs internally to ensure a stable cache key regardless of display order.
 */
export function useFavoritePokemon(ids: number[]) {
  // Sort IDs for a stable query key to maximize cache hits
  const sortedIds = [...ids].sort((a, b) => a - b);

  return useQuery({
    queryKey: ["favorite-pokemon-details", sortedIds],
    queryFn: () => PokedexRepository.getPokemonByIds(sortedIds),
    enabled: ids.length > 0,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
