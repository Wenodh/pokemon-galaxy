import { SortableItem, sortItems, SortConfig } from "@/features/search/sort";

export type SortOption = "number-asc" | "number-desc" | "name-asc" | "name-desc";

/**
 * Maps legacy SortOption to new SortConfig.
 */
const mapSortOptionToConfig = (sortBy: SortOption): SortConfig => {
  switch (sortBy) {
    case "number-asc":
      return { field: "id", direction: "asc" };
    case "number-desc":
      return { field: "id", direction: "desc" };
    case "name-asc":
      return { field: "name", direction: "asc" };
    case "name-desc":
      return { field: "name", direction: "desc" };
    default:
      return { field: "id", direction: "asc" };
  }
};

/**
 * Filters Pokémon list by name or ID.
 * TODO: Move this to a shared filter engine if applicable in future phases.
 */
export function filterPokemon<T extends SortableItem>(items: T[], query: string): T[] {
  if (!query) return items;

  const searchLower = query.toLowerCase();
  return items.filter((p) => {
    const matchesName = p.name?.toLowerCase().includes(searchLower);
    const matchesId = p.id.toString().includes(query);
    return matchesName || matchesId;
  });
}

/**
 * Sorts Pokémon list based on the selected option using the universal sort engine.
 */
export function sortPokemon<T extends SortableItem>(items: T[], sortBy: SortOption): T[] {
  const config = mapSortOptionToConfig(sortBy);
  return sortItems(items, config);
}
