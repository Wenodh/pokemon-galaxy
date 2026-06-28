import { useQuery } from "@tanstack/react-query";
import { PokedexRepository } from "@/features/pokedex/services/pokedex-repository";

/**
 * Hook to fetch details for a list of favorite Pokémon IDs.
 */
export function useFavoritePokemon(ids: number[]) {
  return useQuery({
    queryKey: ["favorite-pokemon-details", ids],
    queryFn: () => PokedexRepository.getPokemonByIds(ids),
    enabled: ids.length > 0,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
