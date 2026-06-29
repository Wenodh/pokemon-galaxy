import { COMPARATORS } from "./comparators";
import { SortConfig, SortableItem } from "./sort.types";

/**
 * Generic sorting function for any collection of items.
 * Uses a registry of comparators and handles direction.
 * Ensures stable sorting and immutable operations.
 */
export function sortItems<T extends SortableItem>(
  items: T[],
  config: SortConfig
): T[] {
  if (!items || items.length <= 1) {
    return items ? [...items] : [];
  }

  const { field, direction } = config;
  const comparator = COMPARATORS[field];

  if (!comparator) {
    console.warn(`No comparator found for sort field: ${field}`);
    return [...items];
  }

  return [...items].sort((a, b) => {
    const result = comparator(a, b);

    // If the comparator found a difference, apply the direction
    if (result !== 0) {
      return direction === "asc" ? result : -result;
    }

    // If values are equal, tie-break by ID ascending (stable sorting)
    return a.id - b.id;
  });
}
