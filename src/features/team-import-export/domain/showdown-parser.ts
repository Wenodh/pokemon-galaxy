export interface ParsedShowdownTeam {
  name: string;
  pokemonNames: string[];
}

export class ShowdownParser {
  /**
   * Parses a basic Pokémon Showdown text format.
   * Format:
   * === Team Name ===
   *
   * Species
   * Level: 100
   *
   * Species 2
   */
  static parse(text: string): ParsedShowdownTeam {
    const lines = text.split("\n").map(l => l.trim());
    let teamName = "";
    const pokemonNames: string[] = [];

    let currentPokemonName = "";

    lines.forEach((line) => {
      if (!line) {
        if (currentPokemonName) {
            pokemonNames.push(currentPokemonName);
            currentPokemonName = "";
        }
        return;
      }

      // Detect team name: === Name ===
      const nameMatch = line.match(/^===\s*(.*?)\s*===$/);
      if (nameMatch) {
        teamName = nameMatch[1];
        return;
      }

      // If it's a "key: value" line (like Level: 100), it's part of the current Pokemon's data
      if (line.includes(":")) {
        return;
      }

      // If it starts with - it's a move
      if (line.startsWith("-")) {
          return;
      }

      // Standard Showdown first line: Species (Nickname) @ Item
      // Or just: Species
      // Since we only care about species for now:
      if (!currentPokemonName) {
          // Extract everything before ( or @ or the end of line
          const speciesPart = line.split(/[(@]/)[0].trim();
          if (speciesPart) {
              currentPokemonName = speciesPart;
          }
      }
    });

    // Catch the last one if it didn't end with an empty line
    if (currentPokemonName) {
      pokemonNames.push(currentPokemonName);
    }

    return {
      name: teamName,
      pokemonNames: pokemonNames.slice(0, 24), // Safety limit
    };
  }
}
