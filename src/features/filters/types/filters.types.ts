import { FilterOperator } from "./filter-operators";

export type LogicalOperator = "and" | "or";

export interface FilterDefinition {
  field: string;
  operator: FilterOperator;
  value: any;
}

export interface FilterGroup {
  operator: LogicalOperator;
  filters: (FilterDefinition | FilterGroup)[];
}

export type FilterState = FilterGroup;

export interface FilterOptions<T> {
  data: T[];
  filters: FilterState;
}
