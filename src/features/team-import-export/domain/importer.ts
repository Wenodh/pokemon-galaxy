import { PokedexRepository } from "@/features/pokedex/services/pokedex-repository";
import { ImportValidationResult } from "../types/import-export.types";
import { TeamValidator } from "./validators";
import { ShowdownParser } from "./showdown-parser";

export class TeamImporter {
  /**
   * Imports a team from a JSON string.
   */
  static async importFromJson(jsonString: string): Promise<ImportValidationResult> {
    try {
      const data = JSON.parse(jsonString);
      return TeamValidator.validateJson(data);
    } catch (e) {
      return {
        success: false,
        errors: [{ code: "INVALID_JSON", message: "The provided text is not valid JSON." }],
      };
    }
  }

  /**
   * Imports a team from Pokémon Showdown text.
   */
  static async importFromShowdown(text: string): Promise<ImportValidationResult> {
    if (!text.trim()) {
        return {
            success: false,
            errors: [{ code: "MALFORMED_SHOWDOWN", message: "Input is empty." }]
        };
    }

    const parsed = ShowdownParser.parse(text);

    // Resolve names to IDs
    const resolvedIds: (number | null)[] = [];

    for (const p of parsed.pokemon) {
        const pokemon = await PokedexRepository.getPokemonByName(p.species);
        resolvedIds.push(pokemon ? pokemon.id : null);
    }

    return TeamValidator.validateShowdownResults(parsed, resolvedIds);
  }
}
