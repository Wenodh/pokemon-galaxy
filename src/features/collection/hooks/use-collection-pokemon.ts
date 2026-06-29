import { useQuery } from "@tanstack/react-query";
import { PokedexRepository } from "@/features/pokedex/services/pokedex-repository";

/**
 * Hook to fetch details for a list of Pokémon IDs in the user's collection.
 */
export function useCollectionPokemon(ids: number[]) {
  const sortedIds = [...ids].sort((a, b) => a - b);

  return useQuery({
    queryKey: ["collection-pokemon-details", sortedIds],
    queryFn: () => PokedexRepository.getPokemonByIds(sortedIds),
    enabled: ids.length > 0,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
