import { normalizeString } from "../utils/normalize";
import { isFuzzyMatch } from "./fuzzy-search";

export enum SearchRank {
  EXACT_ID = 1,
  EXACT_NAME = 2,
  PREFIX_MATCH = 3,
  PARTIAL_MATCH = 4,
  FUZZY_MATCH = 5,
  NO_MATCH = 100,
}

export interface SearchableItem {
  id: number;
  name: string;
}

/**
 * Assigns a rank to an item based on how well it matches the query.
 * Lower rank means higher priority.
 */
export function calculateRank(
  query: string,
  item: SearchableItem,
  isNormalized: boolean = false
): SearchRank {
  const normalizedQuery = isNormalized ? query : normalizeString(query);
  const normalizedName = normalizeString(item.name);
  const stringId = item.id.toString();

  // 1. Exact ID
  // Since query is normalized (accents removed), stringId comparison is safe
  if (stringId === normalizedQuery) {
    return SearchRank.EXACT_ID;
  }

  // 2. Exact Name
  if (normalizedName === normalizedQuery) {
    return SearchRank.EXACT_NAME;
  }

  // 3. Prefix Match
  if (normalizedName.startsWith(normalizedQuery)) {
    return SearchRank.PREFIX_MATCH;
  }

  // 4. Partial Match
  if (normalizedName.includes(normalizedQuery)) {
    return SearchRank.PARTIAL_MATCH;
  }

  // 5. Fuzzy Match
  if (isFuzzyMatch(normalizedQuery, normalizedName)) {
    return SearchRank.FUZZY_MATCH;
  }

  return SearchRank.NO_MATCH;
}
