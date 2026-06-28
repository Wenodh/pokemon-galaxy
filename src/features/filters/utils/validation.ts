import { isFilterGroup } from "../engine/filter-evaluator";

/**
 * Validates a filter state structure.
 */
export function validateFilters(filters: any): boolean {
  if (!filters || typeof filters !== "object") return false;

  // Root must be a filter group
  if (!isFilterGroup(filters)) return false;

  const { operator, filters: childFilters } = filters;

  if (operator !== "and" && operator !== "or") return false;
  if (!Array.isArray(childFilters)) return false;

  // Validate children recursively
  for (const f of childFilters) {
    if (isFilterGroup(f)) {
      if (!validateFilters(f)) return false;
    } else {
      // It's a FilterDefinition
      if (!f.field || !f.operator) return false;
      if (f.value === undefined) return false;
    }
  }

  return true;
}
