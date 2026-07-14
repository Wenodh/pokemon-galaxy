import { describe, it, expect, beforeEach } from "vitest";
import { useCollectionsStore } from "../store/collections.store";
import { useLivingDexStore } from "../store/living-dex.store";
import { validateCollectionName } from "../utils/validation";
import { calculateCollectionStats, calculateProgressStats } from "../utils/statistics";

describe("Collections & Living Pokédex Foundation Tests", () => {
  beforeEach(() => {
    // Reset stores before each test
    useCollectionsStore.setState({
      collections: {},
      collectionOrder: [],
    });
    useLivingDexStore.getState().clearLivingDex();
  });

  describe("Validation Utilities", () => {
    it("should allow valid trimmed names", () => {
      const res = validateCollectionName("  Kanto Favorites  ", []);
      expect(res.ok).toBe(true);
      expect((res as any).value).toBe("Kanto Favorites");
    });

    it("should reject empty names", () => {
      const res = validateCollectionName("   ", []);
      expect(res.ok).toBe(false);
      expect((res as any).error).toBe("EMPTY_NAME");
    });

    it("should reject names that are too long", () => {
      const longName = "A".repeat(45);
      const res = validateCollectionName(longName, []);
      expect(res.ok).toBe(false);
      expect((res as any).error).toBe("NAME_TOO_LONG");
    });

    it("should reject duplicate collection names (case-insensitive)", () => {
      const existing = [
        {
          id: "1",
          name: "Shinies",
          description: "",
          pokemonIds: [],
          createdAt: 0,
          updatedAt: 0,
        },
      ];
      const res = validateCollectionName("shinies", existing);
      expect(res.ok).toBe(false);
      expect((res as any).error).toBe("DUPLICATE_NAME");
    });
  });

  describe("Collections CRUD & Ordering Operations", () => {
    it("should create collections with stable ordering", () => {
      const createRes1 = useCollectionsStore.getState().createCollection("Team A", "First group");
      expect(createRes1.ok).toBe(true);
      const id1 = (createRes1 as any).value;

      const createRes2 = useCollectionsStore.getState().createCollection("Team B");
      expect(createRes2.ok).toBe(true);
      const id2 = (createRes2 as any).value;

      const state = useCollectionsStore.getState();
      expect(state.collectionOrder).toEqual([id1, id2]);
      expect(state.collections[id1].name).toBe("Team A");
      expect(state.collections[id1].description).toBe("First group");
    });

    it("should rename collections properly", () => {
      const createRes = useCollectionsStore.getState().createCollection("Original Name");
      const id = (createRes as any).value;

      const renameRes = useCollectionsStore.getState().renameCollection(id, "New Name");
      expect(renameRes.ok).toBe(true);

      const state = useCollectionsStore.getState();
      expect(state.collections[id].name).toBe("New Name");
    });

    it("should delete collections and order listings", () => {
      const id1 = (useCollectionsStore.getState().createCollection("Col A") as any).value;
      const id2 = (useCollectionsStore.getState().createCollection("Col B") as any).value;

      useCollectionsStore.getState().deleteCollection(id1);

      const state = useCollectionsStore.getState();
      expect(state.collections[id1]).toBeUndefined();
      expect(state.collections[id2]).toBeDefined();
      expect(state.collectionOrder).toEqual([id2]);
    });

    it("should duplicate collections with unique copy names", () => {
      const id = (useCollectionsStore.getState().createCollection("Favorites") as any).value;
      useCollectionsStore.getState().addPokemonToCollection(id, 25); // Pikachu

      const dupRes = useCollectionsStore.getState().duplicateCollection(id);
      expect(dupRes.ok).toBe(true);
      const dupId = (dupRes as any).value;

      const state = useCollectionsStore.getState();
      expect(state.collections[dupId].name).toBe("Favorites Copy");
      expect(state.collections[dupId].pokemonIds).toEqual([25]);
    });

    it("should reorder collection list items", () => {
      const id1 = (useCollectionsStore.getState().createCollection("Col A") as any).value;
      const id2 = (useCollectionsStore.getState().createCollection("Col B") as any).value;
      const id3 = (useCollectionsStore.getState().createCollection("Col C") as any).value;

      // Reorder: Move first item to index 1
      useCollectionsStore.getState().reorderCollections(0, 1);
      expect(useCollectionsStore.getState().collectionOrder).toEqual([id2, id1, id3]);
    });
  });

  describe("Collection Pokémon Operations & Duplicate Prevention", () => {
    it("should add and remove Pokémon from a collection", () => {
      const id = (useCollectionsStore.getState().createCollection("My Team") as any).value;

      const addRes = useCollectionsStore.getState().addPokemonToCollection(id, 6); // Charizard
      expect(addRes.ok).toBe(true);

      let col = useCollectionsStore.getState().collections[id];
      expect(col.pokemonIds).toEqual([6]);

      // Remove Pokémon
      const remRes = useCollectionsStore.getState().removePokemonFromCollection(id, 6);
      expect(remRes.ok).toBe(true);

      col = useCollectionsStore.getState().collections[id];
      expect(col.pokemonIds).toEqual([]);
    });

    it("should prevent duplicate Pokémon in a single collection", () => {
      const id = (useCollectionsStore.getState().createCollection("My Team") as any).value;

      useCollectionsStore.getState().addPokemonToCollection(id, 150); // Mewtwo
      const dupRes = useCollectionsStore.getState().addPokemonToCollection(id, 150);

      expect(dupRes.ok).toBe(false);
      expect((dupRes as any).error).toBe("DUPLICATE_POKEMON");

      const col = useCollectionsStore.getState().collections[id];
      expect(col.pokemonIds).toEqual([150]); // Only one copy
    });

    it("should allow reordering Pokémon inside a specific collection", () => {
      const id = (useCollectionsStore.getState().createCollection("My Team") as any).value;
      useCollectionsStore.getState().addPokemonToCollection(id, 1);
      useCollectionsStore.getState().addPokemonToCollection(id, 4);
      useCollectionsStore.getState().addPokemonToCollection(id, 7);

      // Reorder index 0 (Bulbasaur) to index 2
      useCollectionsStore.getState().reorderPokemonInCollection(id, 0, 2);

      const col = useCollectionsStore.getState().collections[id];
      expect(col.pokemonIds).toEqual([4, 7, 1]);
    });

    it("should support bulk addition and removal", () => {
      const id = (useCollectionsStore.getState().createCollection("Starters") as any).value;

      useCollectionsStore.getState().bulkAddPokemonToCollection(id, [1, 4, 7, 1]); // Charizard is duplicate
      let col = useCollectionsStore.getState().collections[id];
      expect(col.pokemonIds).toEqual([1, 4, 7]); // Deduplicated

      // Bulk remove
      useCollectionsStore.getState().bulkRemovePokemonFromCollection(id, [1, 7]);
      col = useCollectionsStore.getState().collections[id];
      expect(col.pokemonIds).toEqual([4]);
    });
  });

  describe("JSON Import & Export Compatibility", () => {
    it("should export a collection to versioned JSON", () => {
      const id = (useCollectionsStore.getState().createCollection("Anime Team", "Ash's favorites") as any).value;
      useCollectionsStore.getState().addPokemonToCollection(id, 25);

      const exportRes = useCollectionsStore.getState().exportCollection(id);
      expect(exportRes.ok).toBe(true);

      const payload = JSON.parse((exportRes as any).value);
      expect(payload.version).toBe(1);
      expect(payload.collection.name).toBe("Anime Team");
      expect(payload.collection.pokemonIds).toEqual([25]);
    });

    it("should import versioned JSON as a new collection with name uniqueness guaranteed", () => {
      const jsonStr = JSON.stringify({
        version: 1,
        collection: {
          name: "Imported Col",
          description: "From backup",
          pokemonIds: [151, 251],
        },
      });

      // Create an existing collection with same name to test uniqueness
      useCollectionsStore.getState().createCollection("Imported Col");

      const importRes = useCollectionsStore.getState().importCollection(jsonStr);
      expect(importRes.ok).toBe(true);
      const newId = (importRes as any).value;

      const state = useCollectionsStore.getState();
      expect(state.collections[newId].name).toBe("Imported Col Copy");
      expect(state.collections[newId].pokemonIds).toEqual([151, 251]);
    });
  });

  describe("Living Pokédex & Progression store", () => {
    it("should independently track seen and caught status", () => {
      // Pikachu
      useLivingDexStore.getState().markSeen(25);
      let entry = useLivingDexStore.getState().entries[25];
      expect(entry.seen).toBe(true);
      expect(entry.caught).toBe(false);
      expect(entry.firstSeenAt).toBeDefined();

      // Mark caught
      useLivingDexStore.getState().markCaught(25);
      entry = useLivingDexStore.getState().entries[25];
      expect(entry.caught).toBe(true);
      expect(entry.firstCaughtAt).toBeDefined();

      // Mark uncaught
      useLivingDexStore.getState().markCaught(25, false);
      entry = useLivingDexStore.getState().entries[25];
      expect(entry.caught).toBe(false);
      expect(entry.seen).toBe(true); // remains seen
    });

    it("should support bulk marking inside Living Dex", () => {
      useLivingDexStore.getState().bulkMarkCaught([1, 4, 7]);

      const entries = useLivingDexStore.getState().entries;
      expect(entries[1].caught).toBe(true);
      expect(entries[4].caught).toBe(true);
      expect(entries[7].caught).toBe(true);
      expect(entries[1].seen).toBe(true);
    });
  });

  describe("Statistics & Progress Calculations", () => {
    it("should accurately calculate distribution, averages, special counts", () => {
      const dummyPokemon = [
        { id: 144, types: ["Ice", "Flying"], stats: [{ name: "hp", value: 90 }, { name: "attack", value: 85 }] }, // Articuno (Legendary)
        { id: 151, types: ["Psychic"], stats: [{ name: "hp", value: 100 }, { name: "attack", value: 100 }] }, // Mew (Mythical)
        { id: 1, types: ["Grass", "Poison"], stats: [{ name: "hp", value: 45 }, { name: "attack", value: 49 }] }, // Bulbasaur
      ];

      const stats = calculateCollectionStats(dummyPokemon);

      expect(stats.totalCount).toBe(3);
      expect(stats.legendaryCount).toBe(1);
      expect(stats.mythicalCount).toBe(1);

      // Charizard is Gen 1, Bulbasaur is Gen 1, Mew is Gen 1
      expect(stats.generationDistribution["Generation I"]).toBe(3);

      // Type breakdown (Ice, Flying, Psychic, Grass, Poison)
      expect(stats.typeDistribution["psychic"]).toBe(1);
      expect(stats.typeDistribution["poison"]).toBe(1);

      // Average BST
      // Articuno = 90 + 85 = 175
      // Mew = 100 + 100 = 200
      // Bulbasaur = 45 + 49 = 94
      // Average = (175 + 200 + 94) / 3 = 469 / 3 = 156
      expect(stats.averageBST).toBe(156);
    });

    it("should accurately calculate progress percentages", () => {
      const mockEntries = {
        1: { pokemonId: 1, seen: true, caught: true },
        2: { pokemonId: 2, seen: true, caught: false },
        3: { pokemonId: 3, seen: false, caught: false },
      };

      const progress = calculateProgressStats(mockEntries, [1, 2, 3]);
      expect(progress.seen).toBe(2);
      expect(progress.caught).toBe(1);
      expect(progress.total).toBe(3);
      expect(progress.percentage).toBe(33); // 1/3 = 33%
    });
  });
});
