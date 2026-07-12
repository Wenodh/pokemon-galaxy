import { describe, it, expect } from "vitest";
import { BattleEngine } from "../battle-engine";
import { Battle, BattlePokemon } from "../battle-types";
import { SeededRandom } from "../random";

describe("BattleEngine", () => {
  const mockPokemon = (id: number, name: string): BattlePokemon => ({
    id,
    name,
    level: 50,
    maxHp: 100,
    currentHp: 100,
    stats: { hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100 },
    types: ["Normal"],
    image: "",
    fainted: false
  });

  const createMockBattle = (): Battle => ({
    id: "test",
    seed: 12345,
    currentTurn: 1,
    state: {
      player: {
        team: [mockPokemon(1, "Pikachu"), mockPokemon(2, "Bulbasaur")],
        activePokemonIndex: 0,
      },
      opponent: {
        team: [mockPokemon(3, "Charmander")],
        activePokemonIndex: 0,
      },
      status: "ONGOING",
      attacker: "PLAYER",
      defender: "OPPONENT",
    },
    log: []
  });

  it("calculates damage deterministically", () => {
    const attacker = mockPokemon(1, "Attacker");
    const defender = mockPokemon(2, "Defender");
    const move: any = { basePower: 40, type: "Normal", category: "PHYSICAL", accuracy: 100 };
    const random = new SeededRandom(12345);

    const result = BattleEngine.calculateDamage(attacker, defender, move, random);
    expect(result.damage).toBeGreaterThan(0);

    const result2 = BattleEngine.calculateDamage(attacker, defender, move, new SeededRandom(12345));
    expect(result.damage).toBe(result2.damage);
  });

  it("applies attack action and reduces HP", () => {
    const battle = createMockBattle();
    const action: any = { type: "ATTACK" as const, payload: { moveName: "Tackle", basePower: 40, type: "Normal", category: "PHYSICAL", accuracy: 100, priority: 0 } };

    const result = BattleEngine.applyAction(battle, action, "PLAYER");

    expect(result.state.opponent.team[0].currentHp).toBeLessThan(100);
    expect(result.log).toContainEqual(expect.objectContaining({ type: "ATTACK" }));
    expect(result.log).toContainEqual(expect.objectContaining({ type: "DAMAGE" }));
  });

  it("handles switching Pokémon", () => {
    const battle = createMockBattle();
    const action = { type: "SWITCH" as const, payload: { index: 1 } };

    const result = BattleEngine.applyAction(battle, action, "PLAYER");

    expect(result.state.player.activePokemonIndex).toBe(1);
    expect(result.log).toContainEqual(expect.objectContaining({ type: "SWITCH" }));
  });

  it("detects victory when opponent team faints", () => {
    const battle = createMockBattle();
    // High power to ensure faint
    const action: any = { type: "ATTACK" as const, payload: { moveName: "Super Move", basePower: 500, type: "Normal", category: "PHYSICAL", accuracy: 100, priority: 0 } };

    const result = BattleEngine.applyAction(battle, action, "PLAYER");

    expect(result.state.opponent.team[0].currentHp).toBe(0);
    expect(result.state.opponent.team[0].fainted).toBe(true);
    expect(result.state.status).toBe("VICTORY");
    expect(result.state.winner).toBe("PLAYER");
    expect(result.log).toContainEqual(expect.objectContaining({ type: "VICTORY" }));
  });

  it("advances turn counter when player turn ends", () => {
    const battle = createMockBattle();
    battle.state.attacker = "OPPONENT";
    const action = { type: "SKIP" as const };

    const result = BattleEngine.applyAction(battle, action, "OPPONENT");

    expect(result.currentTurn).toBe(2);
    expect(result.state.attacker).toBe("PLAYER");
  });
});
