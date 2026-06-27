import { graphqlClient } from "@/lib/api/graphql-client";
import { GET_POKEMON_DETAILS, GET_EVOLUTION_CHAIN, GET_RELATED_POKEMON, } from "../api/queries";
import { PokemonDetailsResponse, PokemonDetails, EvolutionChainResponse, EvolutionNode, PokemonListItem, PokemonListResponse, Move } from "../types";
export class PokemonRepository {
  private static extractImage(spritesData: unknown, id: number): string {
    let image = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" + id + ".png";
    try {
      const parsed = typeof spritesData === "string" ? JSON.parse(spritesData) : (spritesData as Record<string, unknown>);
      if (!parsed) return image;
      const other = parsed.other as Record<string, Record<string, unknown>> | undefined;
      const artwork = (other?.["official-artwork"] as Record<string, unknown>)?.front_default;
      const dreamWorld = (other?.dream_world as Record<string, unknown>)?.front_default;
      const home = (other?.home as Record<string, unknown>)?.front_default;
      const defaultSprite = parsed.front_default as string | undefined;
      image = (artwork as string) || (dreamWorld as string) || (home as string) || defaultSprite || image;
    } catch { }
    return image;
  }
  static async getPokemonDetails(name: string): Promise<PokemonDetails | null> {
    try {
      const data = await graphqlClient.request<PokemonDetailsResponse>(GET_POKEMON_DETAILS, { name: name.toLowerCase() });
      const pokemon = data.pokemon_v2_pokemon[0];
      if (!pokemon) return null;
      const species = pokemon.pokemon_v2_pokemonspecy;
      return {
        id: pokemon.id, name: pokemon.name, height: pokemon.height, weight: pokemon.weight, baseExperience: pokemon.base_experience,
        types: pokemon.pokemon_v2_pokemontypes.map((t) => t.pokemon_v2_type.name),
        typeIds: pokemon.pokemon_v2_pokemontypes.map((t) => t.pokemon_v2_type.id),
        stats: pokemon.pokemon_v2_pokemonstats.map((s) => ({ name: s.pokemon_v2_stat.name, value: s.base_stat })),
        abilities: pokemon.pokemon_v2_pokemonabilities.map((a) => ({ name: a.pokemon_v2_ability.name, isHidden: a.is_hidden, description: a.pokemon_v2_ability.pokemon_v2_abilityeffecttexts[0]?.short_effect || "", })),
        image: this.extractImage(pokemon.pokemon_v2_pokemonsprites[0]?.sprites, pokemon.id),
        genus: species.pokemon_v2_pokemonspeciesnames[0]?.genus || "", generation: species.pokemon_v2_generation.name, generationId: species.generation_id,
        flavorText: species.pokemon_v2_pokemonspeciesflavortexts[0]?.flavor_text?.replace(/\f/g, " ") || "", evolutionChainId: species.pokemon_v2_evolutionchain.id,
        moves: Array.from(
          pokemon.pokemon_v2_pokemonmoves
            .reduce((acc, m) => {
              const name = m.pokemon_v2_move.name;
              const current = acc.get(name);
              const currentLevel = current?.level ?? 0;
              if (!current || (m.level > 0 && (currentLevel === 0 || m.level < currentLevel))) {
                acc.set(name, {
                  name,
                  accuracy: m.pokemon_v2_move.accuracy,
                  power: m.pokemon_v2_move.power,
                  pp: m.pokemon_v2_move.pp,
                  type: m.pokemon_v2_move.pokemon_v2_type.name,
                  category: m.pokemon_v2_move.pokemon_v2_movedamageclass.name,
                  learnMethod: m.pokemon_v2_movelearnmethod.name,
                  level: m.level,
                });
              }
              return acc;
            }, new Map<string, Move>())
            .values()
        ),
      };
    } catch (error) { console.error("PokemonRepository.getPokemonDetails error:", JSON.stringify(error, null, 2)); return null; }
  }
  static async getEvolutionChain(id: number): Promise<EvolutionNode | null> {
    try {
      const data = await graphqlClient.request<EvolutionChainResponse>(GET_EVOLUTION_CHAIN, { id });
      const chain = data.pokemon_v2_evolutionchain_by_pk;
      if (!chain) return null;
      const speciesList = chain.pokemon_v2_pokemonspecies;
      const buildTree = (parentId: number | null): EvolutionNode[] => {
        return speciesList.filter((s) => s.evolves_from_species_id === parentId).map((s) => ({
          id: s.id, name: s.name, image: this.extractImage(s.pokemon_v2_pokemons[0]?.pokemon_v2_pokemonsprites[0]?.sprites, s.pokemon_v2_pokemons[0]?.id), evolvesFromId: s.evolves_from_species_id, children: buildTree(s.id),
        }));
      };
      const rootNodes = buildTree(null);
      return rootNodes[0] || null;
    } catch (error) { console.error("PokemonRepository.getEvolutionChain error:", error); return null; }
  }
  static async getRelatedPokemon(typeIds: number[], currentPokemonId: number, limit: number = 6): Promise<PokemonListItem[]> {
    try {
      const data = await graphqlClient.request<PokemonListResponse>(GET_RELATED_POKEMON, { typeIds, limit: limit + 1 });
      return data.pokemon_v2_pokemon.filter((p) => p.id !== currentPokemonId).slice(0, limit).map((p) => ({
        id: p.id, name: p.name, types: p.pokemon_v2_pokemontypes.map((t) => t.pokemon_v2_type.name), image: this.extractImage(p.pokemon_v2_pokemonsprites[0]?.sprites, p.id),
      }));
    } catch (error) { console.error("PokemonRepository.getRelatedPokemon error:", error); return []; }
  }
}
