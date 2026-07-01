import { ImportValidationResult, ImportError } from "../types/import-export.types";
import { IMPORT_EXPORT_VERSION } from "../constants/format-version";

export class TeamValidator {
  /**
   * Validates the structure and content of a JSON-exported team.
   */
  static validateJson(data: any): ImportValidationResult {
    const errors: ImportError[] = [];

    if (!data || typeof data !== "object") {
      return {
        success: false,
        errors: [{ code: "INVALID_JSON", message: "Input is not a valid JSON object." }],
      };
    }

    if (data.version === undefined) {
      errors.push({ code: "INVALID_SCHEMA", message: "Missing version field." });
    } else if (data.version > IMPORT_EXPORT_VERSION) {
      errors.push({
        code: "UNSUPPORTED_VERSION",
        message: `Version ${data.version} is not supported. Max version is ${IMPORT_EXPORT_VERSION}.`,
      });
    }

    if (!data.team) {
      errors.push({ code: "INVALID_SCHEMA", message: "Missing team data." });
    } else {
      const { name, pokemon } = data.team;

      if (!name || typeof name !== "string") {
        errors.push({ code: "INVALID_SCHEMA", message: "Invalid or missing team name." });
      }

      if (!Array.isArray(pokemon)) {
        errors.push({ code: "INVALID_SCHEMA", message: "Missing or invalid Pokémon list." });
      } else {
        if (pokemon.length === 0) {
          errors.push({ code: "EMPTY_TEAM", message: "Team must contain at least one Pokémon." });
        }
        if (pokemon.length > 6) {
          errors.push({ code: "TEAM_TOO_LARGE", message: "Team cannot contain more than 6 Pokémon." });
        }

        const uniqueIds = new Set(pokemon);
        if (uniqueIds.size !== pokemon.length) {
          errors.push({ code: "DUPLICATE_POKEMON", message: "Team contains duplicate Pokémon." });
        }

        // Basic ID validation (should be numbers)
        if (pokemon.some(id => typeof id !== "number")) {
           errors.push({ code: "INVALID_SCHEMA", message: "Pokémon IDs must be numbers." });
        }
      }
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    return {
      success: true,
      team: {
        name: data.team.name,
        pokemonIds: data.team.pokemon,
      },
      errors: [],
    };
  }

  /**
   * Validates the intermediate results of a Showdown import after name resolution.
   */
  static validateShowdownResults(
    teamName: string,
    pokemonIds: (number | null)[],
    originalNames: string[]
  ): ImportValidationResult {
    const errors: ImportError[] = [];

    if (pokemonIds.length === 0) {
        errors.push({ code: "EMPTY_TEAM", message: "No Pokémon found in Showdown text." });
    }

    if (pokemonIds.length > 6) {
        errors.push({ code: "TEAM_TOO_LARGE", message: "Showdown team exceeds 6 Pokémon." });
    }

    pokemonIds.forEach((id, index) => {
      if (id === null) {
        errors.push({
          code: "UNKNOWN_POKEMON",
          message: `Could not resolve Pokémon: "${originalNames[index]}"`,
          pokemon: originalNames[index],
        });
      }
    });

    const validIds = pokemonIds.filter((id): id is number => id !== null);
    const uniqueIds = new Set(validIds);
    if (uniqueIds.size !== validIds.length) {
        errors.push({ code: "DUPLICATE_POKEMON", message: "Import contains duplicate Pokémon." });
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    return {
      success: true,
      team: {
        name: teamName || "Imported Showdown Team",
        pokemonIds: validIds,
      },
      errors: [],
    };
  }
}
