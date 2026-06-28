import { FilterGroup, FilterDefinition } from "../types/filters.types";
import { evaluatePredicate } from "./predicate";

/**
 * Checks if an object is a FilterGroup.
 */
export function isFilterGroup(filter: any): filter is FilterGroup {
  return filter && typeof filter === "object" && "operator" in filter && "filters" in filter;
}

/**
 * Recursively evaluates a filter or filter group against an item.
 */
export function evaluateFilter(item: any, filter: FilterDefinition | FilterGroup): boolean {
  if (isFilterGroup(filter)) {
    const { operator, filters } = filter;

    if (filters.length === 0) return true;

    if (operator === "and") {
      return filters.every((f) => evaluateFilter(item, f));
    } else {
      return filters.some((f) => evaluateFilter(item, f));
    }
  }

  return evaluatePredicate(item, filter);
}
