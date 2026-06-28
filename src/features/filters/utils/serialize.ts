import { FilterState } from "../types/filters.types";

/**
 * Serializes a filter state to a JSON string.
 */
export function serializeFilters(filters: FilterState): string {
  try {
    return JSON.stringify(filters);
  } catch (error) {
    console.error("Failed to serialize filters:", error);
    return "";
  }
}

/**
 * Serializes a filter state to a Base64 string for URL usage.
 */
export function serializeFiltersToUrl(filters: FilterState): string {
  const json = serializeFilters(filters);
  if (!json) return "";

  try {
    return btoa(json);
  } catch (error) {
    console.error("Failed to serialize filters to URL:", error);
    return "";
  }
}
