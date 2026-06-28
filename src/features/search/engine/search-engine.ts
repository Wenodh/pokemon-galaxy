import { SearchRank, SearchableItem, calculateRank } from "./ranking";
import { normalizeString } from "../utils/normalize";

/**
 * Main search function to filter and rank items based on a query.
 */
export function searchPokemon<T extends SearchableItem>(
  query: string,
  items: T[]
): T[] {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return items;

  const normalizedQuery = normalizeString(trimmedQuery);
  const results: { item: T; rank: SearchRank }[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    // Optimization: Skip ranking if we already matched 50+ items and rank is potentially low?
    // Actually, for 1500 items, we should be able to rank all of them.
    const rank = calculateRank(normalizedQuery, item, true);
    if (rank !== SearchRank.NO_MATCH) {
      results.push({ item, rank });
    }
  }

  // Only sort if we have results
  if (results.length === 0) return [];

  return results
    .sort((a, b) => {
      const rankDiff = a.rank - b.rank;
      if (rankDiff !== 0) return rankDiff;
      return a.item.id - b.item.id;
    })
    .map((result) => result.item);
}
