/**
 * Validates a Pokémon ID.
 * A valid identifier is:
 * - A finite integer
 * - Greater than 0
 */
export const isValidPokemonId = (id: unknown): id is number => {
  if (typeof id !== "number") return false;
  if (!Number.isFinite(id)) return false;
  if (!Number.isInteger(id)) return false;
  return id > 0;
};

/**
 * Ensures that a list of favorites contains only valid, unique IDs.
 */
export const validateFavorites = (ids: unknown[]): number[] => {
  const validIds = ids.filter(isValidPokemonId);
  return Array.from(new Set(validIds));
};
