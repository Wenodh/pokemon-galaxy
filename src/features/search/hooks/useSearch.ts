import { useMemo } from "react";
import { searchPokemon } from "../engine/search-engine";
import { SearchableItem } from "../engine/ranking";

/**
 * Hook to provide a memoized search interface for components.
 */
export function useSearch<T extends SearchableItem>(
  query: string,
  items: T[]
): T[] {
  return useMemo(() => {
    return searchPokemon(query, items);
  }, [query, items]);
}
