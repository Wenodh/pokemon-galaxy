import { FilterDefinition } from "../types/filters.types";

/**
 * Evaluates a single filter definition against an item.
 */
export function evaluatePredicate(item: any, filter: FilterDefinition): boolean {
  const { field, operator, value } = filter;
  const itemValue = item[field];

  switch (operator) {
    // Numeric Operators
    case ">":
      return typeof itemValue === "number" && itemValue > value;
    case "<":
      return typeof itemValue === "number" && itemValue < value;
    case ">=":
      return typeof itemValue === "number" && itemValue >= value;
    case "<=":
      return typeof itemValue === "number" && itemValue <= value;
    case "=":
      return itemValue === value;
    case "between":
      return (
        typeof itemValue === "number" &&
        Array.isArray(value) &&
        itemValue >= value[0] &&
        itemValue <= value[1]
      );

    // String Operators
    case "equals":
      return typeof itemValue === "string" && itemValue.toLowerCase() === String(value).toLowerCase();
    case "contains":
      return typeof itemValue === "string" && itemValue.toLowerCase().includes(String(value).toLowerCase());
    case "startsWith":
      return typeof itemValue === "string" && itemValue.toLowerCase().startsWith(String(value).toLowerCase());

    // Array Operators
    case "includes":
      return Array.isArray(itemValue) && itemValue.includes(value);
    case "includesAny":
      return (
        Array.isArray(itemValue) &&
        Array.isArray(value) &&
        value.some((v) => itemValue.includes(v))
      );
    case "includesAll":
      return (
        Array.isArray(itemValue) &&
        Array.isArray(value) &&
        value.every((v) => itemValue.includes(v))
      );

    // Boolean Operator
    case "is":
      return !!itemValue === !!value;

    default:
      return true;
  }
}
