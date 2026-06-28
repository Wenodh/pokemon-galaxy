import { PokemonId, CollectionEntry } from "../types/collection.types";

/**
 * Validates if a value is a valid Pokémon ID.
 * Pokémon IDs must be positive integers.
 */
export function isValidPokemonId(id: any): id is PokemonId {
  return typeof id === "number" && Number.isInteger(id) && id > 0;
}

/**
 * Validates if a collection entry structure is correct.
 */
export function isValidCollectionEntry(entry: any): entry is CollectionEntry {
  if (!entry || typeof entry !== "object") return false;

  return (
    isValidPokemonId(entry.pokemonId) &&
    typeof entry.seen === "boolean" &&
    typeof entry.caught === "boolean" &&
    typeof entry.shiny === "boolean" &&
    typeof entry.alpha === "boolean" &&
    typeof entry.lucky === "boolean" &&
    typeof entry.updatedAt === "number"
  );
}

/**
 * Validates the entire persisted storage object.
 */
export function validatePersistedCollection(data: any): boolean {
  if (!data || typeof data !== "object") return false;
  if (!data.entries || typeof data.entries !== "object") return false;

  return Object.values(data.entries).every(isValidCollectionEntry);
}
