import { FilterState } from "../types/filters.types";
import { validateFilters } from "./validation";

/**
 * Deserializes a filter state from a JSON string.
 */
export function deserializeFilters(json: string): FilterState | null {
  if (!json) return null;

  try {
    const filters = JSON.parse(json);
    if (validateFilters(filters)) {
      return filters as FilterState;
    }
    return null;
  } catch (error) {
    console.error("Failed to deserialize filters:", error);
    return null;
  }
}

/**
 * Deserializes a filter state from a Base64 URL string.
 */
export function deserializeFiltersFromUrl(base64: string): FilterState | null {
  if (!base64) return null;

  try {
    const json = atob(base64);
    return deserializeFilters(json);
  } catch (error) {
    console.error("Failed to deserialize filters from URL:", error);
    return null;
  }
}
