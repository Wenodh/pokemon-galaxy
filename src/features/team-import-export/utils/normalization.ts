/**
 * Robust normalization utility for Pokémon names.
 * Handles official edge cases like "Ho-Oh", "Mr. Mime", "Sirfetch'd", "Tapu Koko", etc.
 * Normalization is deterministic and matches PokeAPI/Showdown conventions where possible.
 */
export function normalizePokemonName(name: string): string {
  if (!name) return "";

  let normalized = name.trim().toLowerCase();

  // 1. Handle common punctuation and special characters
  // Remove periods (Mr. Mime -> mr mime)
  normalized = normalized.replace(/\./g, "");

  // Remove apostrophes (Sirfetch'd -> sirfetchd, Farfetch'd -> farfetchd)
  normalized = normalized.replace(/'/g, "");

  // 2. Handle specific species that use colons or other separators
  // Type: Null -> type-null
  normalized = normalized.replace(/:/g, "");

  // 3. Convert spaces and underscores to hyphens
  normalized = normalized.replace(/[\s_]+/g, "-");

  // 4. Special cases for PokeAPI/Showdown mismatches or specific formatting
  // Tapu Koko -> tapu-koko (already handled by space to hyphen)
  // Paradox Pokemon: Great Tusk -> great-tusk

  // Mime Jr -> mime-jr
  // Mr Mime -> mr-mime

  // Ensure we don't have multiple hyphens
  normalized = normalized.replace(/-+/g, "-");

  // Handle specific PokeAPI mismatches
  if (normalized === "farfetchd") return "farfetch-d";
  if (normalized === "sirfetchd") return "sirfetch-d";

  return normalized;
}
