export type SortDirection = "asc" | "desc";

export type SortField =
  | "id"
  | "name"
  | "hp"
  | "attack"
  | "defense"
  | "special-attack"
  | "special-defense"
  | "speed"
  | "base-stats-total"
  | "height"
  | "weight";

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

/**
 * Interface for items that can be sorted by the engine.
 * Fields are optional to allow for different data models.
 * 'id' is required for stable tie-breaking.
 */
export interface SortableItem {
  id: number;
  name?: string;
  hp?: number;
  attack?: number;
  defense?: number;
  "special-attack"?: number;
  "special-defense"?: number;
  speed?: number;
  "base-stats-total"?: number;
  height?: number;
  weight?: number;
  // Allow for indexing with SortField
  [key: string]: any;
}
