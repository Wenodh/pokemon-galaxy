import { normalizeString } from "../utils/normalize";

/**
 * Tokenizes a query string into a list of normalized tokens.
 */
export function tokenize(query: string): string[] {
  return normalizeString(query)
    .split(/[\s-]+/)
    .filter((token) => token.length > 0);
}
