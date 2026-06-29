import { useMemo } from "react";
import { sortItems, SortConfig, SortableItem } from "../sort";

/**
 * Hook to provide a memoized sorting interface for components.
 */
export function useSort<T extends SortableItem>(
  items: T[],
  config: SortConfig
): T[] {
  return useMemo(() => {
    return sortItems(items, config);
  }, [items, config.field, config.direction]);
}
