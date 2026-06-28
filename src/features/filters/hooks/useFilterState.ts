import { useState, useCallback } from "react";
import { FilterState } from "../types/filters.types";
import { FilterOperator } from "../types/filter-operators";

/**
 * Hook to manage local filter state.
 */
export function useFilterState(initialState?: FilterState) {
  const [filters, setFilters] = useState<FilterState>(
    initialState || { operator: "and", filters: [] }
  );

  const addFilter = useCallback((field: string, operator: FilterOperator, value: any) => {
    setFilters((prev) => ({
      ...prev,
      filters: [...prev.filters, { field, operator, value }],
    }));
  }, []);

  const removeFilter = useCallback((field: string) => {
    setFilters((prev) => ({
      ...prev,
      filters: prev.filters.filter((f) => !("field" in f) || f.field !== field),
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ operator: "and", filters: [] });
  }, []);

  const updateFilter = useCallback((field: string, operator: FilterOperator, value: any) => {
    setFilters((prev) => ({
      ...prev,
      filters: prev.filters.map((f) => {
        if (!("field" in f) || f.field !== field) return f;
        return { field, operator, value };
      }),
    }));
  }, []);

  return {
    filters,
    setFilters,
    addFilter,
    removeFilter,
    updateFilter,
    clearFilters,
  };
}
