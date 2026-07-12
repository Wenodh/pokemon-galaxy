import { describe, it, expect } from "vitest";
import { BattleEngine } from "../battle-engine";
import { Battle, BattlePokemon } from "../battle-types";
import { SeededRandom } from "../random";

describe("BattleEngine Advanced Mechanics", () => {
  const mockPokemon = (id: number, name: string, types: string[]): BattlePokemon => ({
    id,
    name,
    level: 50,
    maxHp: 100,
    currentHp: 100,
    stats: { hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100 },
    types,
    image: "",
    fainted: false
  });

  it("applies STAB multiplier correctly", () => {
    const attacker = mockPokemon(1, "FireType", ["Fire"]);
    const defender = mockPokemon(2, "NormalType", ["Normal"]);
    const move = { moveName: "Ember", basePower: 40, type: "Fire", category: "SPECIAL" as const, accuracy: 100, priority: 0 };
    const random = new SeededRandom(123);

    const result = BattleEngine.calculateDamage(attacker, defender, move, random);
    expect(result.isSTAB).toBe(true);
    // Base: 19, STAB: 19 * 1.5 = 28, Roll 100: 28. (Simplified math for mental check)
  });

  it("calculates Super Effective damage (2x)", () => {
    const attacker = mockPokemon(1, "Attacker", ["Normal"]);
    const defender = mockPokemon(2, "WaterType", ["Water"]);
    const move = { moveName: "Thunderbolt", basePower: 90, type: "Electric", category: "SPECIAL" as const, accuracy: 100, priority: 0 };
    const random = new SeededRandom(456);

    const result = BattleEngine.calculateDamage(attacker, defender, move, random);
    expect(result.effectiveness).toBe(2);
  });

  it("calculates Not Very Effective damage (0.5x)", () => {
    const attacker = mockPokemon(1, "Attacker", ["Normal"]);
    const defender = mockPokemon(2, "FireType", ["Fire"]);
    const move = { moveName: "Ember", basePower: 40, type: "Fire", category: "SPECIAL" as const, accuracy: 100, priority: 0 };
    const random = new SeededRandom(789);

    const result = BattleEngine.calculateDamage(attacker, defender, move, random);
    expect(result.effectiveness).toBe(0.5);
  });

  it("handles dual-type effectiveness (4x)", () => {
    const attacker = mockPokemon(1, "Attacker", ["Normal"]);
    const defender = mockPokemon(2, "GrassSteel", ["Grass", "Steel"]);
    const move = { moveName: "Flamethrower", basePower: 90, type: "Fire", category: "SPECIAL" as const, accuracy: 100, priority: 0 };
    const random = new SeededRandom(111);

    const result = BattleEngine.calculateDamage(attacker, defender, move, random);
    expect(result.effectiveness).toBe(4);
  });

  it("respects type immunities (0x)", () => {
    const attacker = mockPokemon(1, "Attacker", ["Normal"]);
    const defender = mockPokemon(2, "GroundType", ["Ground"]);
    const move = { moveName: "Thunderbolt", basePower: 90, type: "Electric", category: "SPECIAL" as const, accuracy: 100, priority: 0 };
    const random = new SeededRandom(222);

    const result = BattleEngine.calculateDamage(attacker, defender, move, random);
    expect(result.effectiveness).toBe(0);
    expect(result.damage).toBe(0);
  });

  it("uses Special Attack and Special Defense for Special moves", () => {
    const attacker = mockPokemon(1, "Attacker", ["Normal"]);
    attacker.stats.atk = 10;
    attacker.stats.spa = 200;

    const defender = mockPokemon(2, "Defender", ["Normal"]);
    defender.stats.def = 200;
    defender.stats.spd = 10;

    const move = { moveName: "SpecialMove", basePower: 40, type: "Normal", category: "SPECIAL" as const, accuracy: 100, priority: 0 };
    const random = new SeededRandom(333);

    const result = BattleEngine.calculateDamage(attacker, defender, move, random);
    // Since spa/spd are 200/10 vs 10/200, damage should be significantly higher for Special
    expect(result.damage).toBeGreaterThan(100);
  });

  it("determines turn order based on speed", () => {
    const battle: any = {
      state: {
        player: { team: [{ stats: { spe: 100 } }], activePokemonIndex: 0 },
        opponent: { team: [{ stats: { spe: 50 } }], activePokemonIndex: 0 }
      }
    };
    const pAction = { type: "ATTACK" as const, payload: { priority: 0 } };
    const oAction = { type: "ATTACK" as const, payload: { priority: 0 } };

    const order = BattleEngine.getTurnOrder(battle, pAction, oAction);
    expect(order[0]).toBe("PLAYER");
  });

  it("respects move priority over speed", () => {
    const battle: any = {
      state: {
        player: { team: [{ stats: { spe: 10 } }], activePokemonIndex: 0 },
        opponent: { team: [{ stats: { spe: 200 } }], activePokemonIndex: 0 }
      }
    };
    const pAction = { type: "ATTACK" as const, payload: { priority: 1 } };
    const oAction = { type: "ATTACK" as const, payload: { priority: 0 } };

    const order = BattleEngine.getTurnOrder(battle, pAction, oAction);
    expect(order[0]).toBe("PLAYER");
  });

  it("handles move misses based on accuracy", () => {
    const attacker = mockPokemon(1, "Attacker", ["Normal"]);
    const defender = mockPokemon(2, "Defender", ["Normal"]);
    const battle: any = {
      currentTurn: 1,
      seed: 0.1, // Fixed seed for accuracy check
      state: {
        player: { team: [attacker], activePokemonIndex: 0 },
        opponent: { team: [defender], activePokemonIndex: 0 },
        status: "ONGOING"
      },
      log: []
    };
    // Seed 12345 produces random.next() that misses at 10% accuracy
    // Actually, let's just test that it can miss
    const move = { moveName: "MissMove", basePower: 40, type: "Normal", category: "PHYSICAL" as const, accuracy: 1, priority: 0 };
    const action = { type: "ATTACK" as const, payload: move };

    const result = BattleEngine.applyAction(battle, action, "PLAYER");
    expect(result.log.some(e => e.message.includes("missed"))).toBe(true);
  });
});
