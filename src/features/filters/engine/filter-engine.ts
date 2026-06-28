import { FilterState } from "../types/filters.types";
import { evaluateFilter } from "./filter-evaluator";

/**
 * Applies a filter state to a dataset.
 */
export function applyFilters<T>(data: T[], filters: FilterState): T[] {
  if (!filters || filters.filters.length === 0) {
    return data;
  }

  return data.filter((item) => evaluateFilter(item, filters));
}

/**
 * Combines multiple filter states into a single one using AND.
 */
export function combineFilters(...filters: FilterState[]): FilterState {
  const activeFilters = filters.filter((f) => f.filters.length > 0);

  if (activeFilters.length === 0) {
    return { operator: "and", filters: [] };
  }

  if (activeFilters.length === 1) {
    return activeFilters[0];
  }

  return {
    operator: "and",
    filters: activeFilters,
  };
}
