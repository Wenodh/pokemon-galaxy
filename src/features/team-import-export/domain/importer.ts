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
    const pokemonIds: (number | null)[] = [];

    // Process sequentially to avoid hitting rate limits or overwhelming the client
    // although for 6 items it's fine.
    for (const name of parsed.pokemonNames) {
        const pokemon = await PokedexRepository.getPokemonByName(name);
        pokemonIds.push(pokemon ? pokemon.id : null);
    }

    return TeamValidator.validateShowdownResults(parsed.name, pokemonIds, parsed.pokemonNames);
  }
}
