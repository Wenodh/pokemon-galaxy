import { Team } from "@/features/team/types/team.types";
import { ExportedTeam } from "../types/import-export.types";
import { IMPORT_EXPORT_VERSION } from "../constants/format-version";
import { PokemonListItem } from "@/features/pokedex/types";

export class TeamExporter {
  /**
   * Exports a team to Pokémon Galaxy JSON format.
   */
  static exportToJson(team: Team): string {
    const exported: ExportedTeam = {
      version: IMPORT_EXPORT_VERSION,
      team: {
        id: team.id,
        name: team.name,
        pokemon: team.pokemon,
      },
      exportedAt: Date.now(),
    };
    return JSON.stringify(exported, null, 2);
  }

  /**
   * Exports a team to Pokémon Showdown text format.
   * Note: For this phase, only species and level (100) are supported.
   */
  static exportToShowdown(teamName: string, pokemonDetails: PokemonListItem[]): string {
    let output = `=== ${teamName} ===\n\n`;

    pokemonDetails.forEach((p) => {
      // Showdown format: Species (Name) @ Item
      // Since we only have species for now:
      output += `${p.name}\n`;
      output += `Level: 100\n\n`;
    });

    return output.trim();
  }
}
