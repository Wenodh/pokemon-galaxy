import { describe, it, expect, vi, beforeEach } from "vitest";
import { PokedexRepository } from "./pokedex-repository";
import { graphqlClient } from "@/lib/api/graphql-client";

// Mock the graphql-client
vi.mock("@/lib/api/graphql-client", () => ({
  graphqlClient: {
    request: vi.fn(),
  },
}));

describe("PokedexRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should map raw response to PokemonListItem correctly", async () => {
    const mockResponse = {
      pokemon_v2_pokemon: [
        {
          id: 1,
          name: "bulbasaur",
          pokemon_v2_pokemontypes: [
            {
              pokemon_v2_type: { name: "grass" },
            },
            {
              pokemon_v2_type: { name: "poison" },
            },
          ],
          pokemon_v2_pokemonsprites: [
            {
              sprites: {
                other: {
                  "official-artwork": {
                    front_default: "artwork-url",
                  },
                },
              },
            },
          ],
        },
      ],
    };

    vi.mocked(graphqlClient.request).mockResolvedValueOnce(mockResponse);

    const result = await PokedexRepository.getPokemonList(1, 0);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 1,
      name: "bulbasaur",
      types: ["grass", "poison"],
      image: "artwork-url",
    });
  });

  it("should handle empty search filters", async () => {
    vi.mocked(graphqlClient.request).mockResolvedValueOnce({ pokemon_v2_pokemon: [] });
    await PokedexRepository.getPokemonList(20, 0);

    expect(graphqlClient.request).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        where: {}
      })
    );
  });

  it("should handle defined name search filters", async () => {
    vi.mocked(graphqlClient.request).mockResolvedValueOnce({ pokemon_v2_pokemon: [] });
    await PokedexRepository.getPokemonList(20, 0, { search: "pika" });

    expect(graphqlClient.request).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        where: {
          name: { _ilike: "%pika%" }
        }
      })
    );
  });

  it("should handle numeric search filters as ID", async () => {
    vi.mocked(graphqlClient.request).mockResolvedValueOnce({ pokemon_v2_pokemon: [] });
    await PokedexRepository.getPokemonList(20, 0, { search: "25" });

    expect(graphqlClient.request).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        where: {
          id: { _eq: 25 }
        }
      })
    );
  });
});
