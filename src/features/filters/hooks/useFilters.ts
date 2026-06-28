import { useMemo } from "react";
import { FilterState } from "../types/filters.types";
import { applyFilters } from "../engine/filter-engine";

/**
 * Hook to apply filters to a dataset efficiently.
 */
export function useFilters<T>(data: T[], filters: FilterState): T[] {
  return useMemo(() => {
    return applyFilters(data, filters);
  }, [data, filters]);
}
