import { describe, it, expect, beforeEach } from "vitest";
import { useLivingDexStore } from "../store/living-dex.store";
import { REGIONAL_DEXES } from "../constants/regional-dex";
import { calculateProgressStats } from "../utils/statistics";

describe("Living Pokédex Phase 4.1B Experience Tests", () => {
  beforeEach(() => {
    useLivingDexStore.getState().clearLivingDex();
  });

  describe("Regional Dex Registry", () => {
    it("should cover all 10 registered dexes", () => {
      expect(REGIONAL_DEXES.length).toBe(10);
    });

    it("should define National Dex with all 1025 Pokémon", () => {
      const national = REGIONAL_DEXES.find((d) => d.id === "national");
      expect(national).toBeDefined();
      expect(national?.pokemonIds.length).toBe(1025);
      expect(national?.pokemonIds[0]).toBe(1);
      expect(national?.pokemonIds[1024]).toBe(1025);
    });

    it("should define Kanto Dex with first 151 Pokémon", () => {
      const kanto = REGIONAL_DEXES.find((d) => d.id === "kanto");
      expect(kanto).toBeDefined();
      expect(kanto?.pokemonIds.length).toBe(151);
      expect(kanto?.pokemonIds[0]).toBe(1);
      expect(kanto?.pokemonIds[150]).toBe(151);
    });

    it("should define Paldea Dex with correct range 899 to 1025", () => {
      const paldea = REGIONAL_DEXES.find((d) => d.id === "paldea");
      expect(paldea).toBeDefined();
      expect(paldea?.pokemonIds.length).toBe(127); // 1025 - 899 + 1 = 127
      expect(paldea?.pokemonIds[0]).toBe(899);
      expect(paldea?.pokemonIds[126]).toBe(1025);
    });
  });

  describe("Streaks & Future-ready State", () => {
    it("should initialize streak placeholders as undefined for future extensibility", () => {
      const state = useLivingDexStore.getState();
      expect(state.currentStreak).toBeUndefined();
      expect(state.longestStreak).toBeUndefined();
    });
  });

  describe("Recently Caught & Recently Seen Sort", () => {
    it("should track timestamps and allow sorting seen entries descending", () => {
      useLivingDexStore.getState().markSeen(1); // Bulbasaur
      useLivingDexStore.getState().markSeen(4); // Charmander

      const entries = Object.values(useLivingDexStore.getState().entries);
      expect(entries.length).toBe(2);

      // Bulbasaur was seen first, so Charmander has higher timestamp
      const bulbasaur = entries.find((e) => e.pokemonId === 1);
      const charmander = entries.find((e) => e.pokemonId === 4);
      expect(charmander!.firstSeenAt).toBeGreaterThanOrEqual(bulbasaur!.firstSeenAt || 0);
    });
  });

  describe("Advanced Filters and Completion Sorting", () => {
    it("should correctly calculate progress of categories", () => {
      useLivingDexStore.getState().markCaught(1); // Bulbasaur (Caught)
      useLivingDexStore.getState().markSeen(2);   // Ivysaur (Seen)

      const entries = useLivingDexStore.getState().entries;
      const progress = calculateProgressStats(entries, [1, 2, 3]);

      expect(progress.total).toBe(3);
      expect(progress.caught).toBe(1);
      expect(progress.seen).toBe(2);
      expect(progress.percentage).toBe(33); // 1/3 = 33%
    });

    it("should sort species deterministically: Caught > Seen > Not Seen", () => {
      useLivingDexStore.getState().markCaught(2); // Caught
      useLivingDexStore.getState().markSeen(1);   // Seen
      // ID 3 remains Unseen

      const list = [
        { id: 1, name: "Bulbasaur" },
        { id: 2, name: "Ivysaur" },
        { id: 3, name: "Venusaur" },
      ];

      const entries = useLivingDexStore.getState().entries;

      // Sort by Status
      list.sort((a, b) => {
        const entryA = entries[a.id];
        const entryB = entries[b.id];

        const score = (entry: any) => {
          if (!entry) return 0;
          if (entry.caught) return 3;
          if (entry.seen) return 2;
          return 1;
        };

        const scoreA = score(entryA);
        const scoreB = score(entryB);

        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }
        return a.id - b.id;
      });

      // Expected Order: Ivysaur (#2, Caught) -> Bulbasaur (#1, Seen) -> Venusaur (#3, Unseen)
      expect(list[0].id).toBe(2);
      expect(list[1].id).toBe(1);
      expect(list[2].id).toBe(3);
    });
  });
});
