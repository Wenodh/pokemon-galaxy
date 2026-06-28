import { SortableItem, SortField } from "./sort.types";

type Comparator = (a: SortableItem, b: SortableItem) => number;

/**
 * Numeric comparator that handles missing values.
 */
const createNumericComparator = (field: string): Comparator => (a, b) => {
  const valA = a[field] ?? 0;
  const valB = b[field] ?? 0;

  return valA - valB;
};

/**
 * String comparator that handles missing values.
 */
const createStringComparator = (field: string): Comparator => (a, b) => {
  const valA = a[field] ?? "";
  const valB = b[field] ?? "";

  return valA.localeCompare(valB);
};

/**
 * Registry of comparators for each supported sort field.
 * All comparators should return in ascending order.
 * The engine will handle the direction.
 */
export const COMPARATORS: Record<SortField, Comparator> = {
  id: (a, b) => a.id - b.id,
  name: createStringComparator("name"),
  hp: createNumericComparator("hp"),
  attack: createNumericComparator("attack"),
  defense: createNumericComparator("defense"),
  "special-attack": createNumericComparator("special-attack"),
  "special-defense": createNumericComparator("special-defense"),
  speed: createNumericComparator("speed"),
  "base-stats-total": createNumericComparator("base-stats-total"),
  height: createNumericComparator("height"),
  weight: createNumericComparator("weight"),
};
