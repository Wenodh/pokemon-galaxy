import { useCollectionStore } from "../store/collection.store";
import { selectEntryById } from "../store/collection.selectors";
import { PokemonId } from "../types/collection.types";

/**
 * Hook to access the collection status of a specific Pokémon.
 */
export const useCollectionStatus = (id: PokemonId) => {
  const entry = useCollectionStore(selectEntryById(id));

  return {
    isSeen: entry?.seen ?? false,
    isCaught: entry?.caught ?? false,
    isShiny: entry?.shiny ?? false,
    isAlpha: entry?.alpha ?? false,
    isLucky: entry?.lucky ?? false,
    lastUpdated: entry?.updatedAt,
    entry,
  };
};
