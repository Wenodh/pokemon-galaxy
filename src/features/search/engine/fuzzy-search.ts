/**
 * Calculates the Levenshtein distance between two strings using a more memory-efficient algorithm.
 */
export function getLevenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const row = Array.from({ length: a.length + 1 }, (_, i) => i);

  for (let i = 1; i <= b.length; i++) {
    let prev = i;
    for (let j = 1; j <= a.length; j++) {
      const val = b[i - 1] === a[j - 1] ? row[j - 1] : Math.min(row[j - 1] + 1, prev + 1, row[j] + 1);
      row[j - 1] = prev;
      prev = val;
    }
    row[a.length] = prev;
  }

  return row[a.length];
}

/**
 * Checks if a string is a fuzzy match for another based on a distance threshold.
 */
export function isFuzzyMatch(
  query: string,
  target: string,
  threshold: number = 0.3
): boolean {
  if (query.length < 3) return false;

  const distance = getLevenshteinDistance(query, target);
  const maxLen = Math.max(query.length, target.length);

  return distance / maxLen <= threshold;
}
