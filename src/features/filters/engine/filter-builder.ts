import { FilterGroup, LogicalOperator } from "../types/filters.types";
import { FilterOperator } from "../types/filter-operators";

/**
 * Fluent builder for creating complex filter structures.
 */
export class FilterBuilder {
  private group: FilterGroup;

  constructor(operator: LogicalOperator = "and") {
    this.group = { operator, filters: [] };
  }

  static where(field: string, operator: FilterOperator, value: any): FilterBuilder {
    return new FilterBuilder().add(field, operator, value);
  }

  add(field: string, operator: FilterOperator, value: any): this {
    this.group.filters.push({ field, operator, value });
    return this;
  }

  addGroup(group: FilterGroup | FilterBuilder): this {
    const filters = group instanceof FilterBuilder ? group.build() : group;
    this.group.filters.push(filters);
    return this;
  }

  and(): this {
    this.group.operator = "and";
    return this;
  }

  or(): this {
    this.group.operator = "or";
    return this;
  }

  build(): FilterGroup {
    return this.group;
  }
}

export function buildFilter(operator: LogicalOperator = "and"): FilterBuilder {
  return new FilterBuilder(operator);
}
