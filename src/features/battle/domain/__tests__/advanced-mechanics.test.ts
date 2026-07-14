import { describe, it, expect } from "vitest";
import { BattleEngine } from "../battle-engine";
import { Battle, BattlePokemon } from "../battle-types";

describe("BattleEngine Advanced Integration", () => {
  const mockPokemon = (name: string, overrides: Partial<BattlePokemon> = {}): BattlePokemon => ({
    id: Math.floor(Math.random() * 1000),
    name,
    level: 50,
    maxHp: 100,
    currentHp: 100,
    stats: { hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100 },
    types: ["Normal"],
    image: "",
    fainted: false,
    status: "NONE",
    statusTurns: 0,
    ability: "",
    item: "",
    statChanges: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    ...overrides
  });

  const createBattle = (pTeam: BattlePokemon[], oTeam: BattlePokemon[]): Battle => ({
    id: "test",
    seed: 12345,
    currentTurn: 1,
    state: {
      player: {
        team: pTeam, activePokemonIndex: 0,
        hazards: { stealthRock: false, spikes: 0, toxicSpikes: 0, stickyWeb: false },
        fieldEffects: { reflect: 0, lightScreen: 0, auroraVeil: 0, tailwind: 0 }
      },
      opponent: {
        team: oTeam, activePokemonIndex: 0,
        hazards: { stealthRock: false, spikes: 0, toxicSpikes: 0, stickyWeb: false },
        fieldEffects: { reflect: 0, lightScreen: 0, auroraVeil: 0, tailwind: 0 }
      },
      status: "ONGOING",
      weather: { type: "NONE", turns: 0 },
      terrain: { type: "NONE", turns: 0 },
      attacker: "PLAYER",
      defender: "OPPONENT",
    },
    log: []
  });

  it("handles Leftovers healing at end of turn", () => {
    const p1 = mockPokemon("Healer", { currentHp: 50, item: "Leftovers" });
    const o1 = mockPokemon("Opponent");
    const battle = createBattle([p1], [o1]);

    // Resolve a turn where both skip
    const action = { type: "SKIP" as const };
    const result = BattleEngine.resolveTurn(battle, action, action);

    expect(result.state.player.team[0].currentHp).toBe(56); // 50 + floor(100/16) = 56
    expect(result.log.some(e => e.message.includes("Leftovers"))).toBe(true);
  });

  it("handles Burn damage at end of turn and Attack reduction", () => {
    const p1 = mockPokemon("Burned", { status: "BURN" });
    const o1 = mockPokemon("Defender");
    const battle = createBattle([p1], [o1]);

    const attack = {
        type: "ATTACK" as const,
        payload: { moveName: "Tackle", basePower: 40, type: "Normal", category: "PHYSICAL", accuracy: 100, priority: 0 }
    };
    const skip = { type: "SKIP" as const };

    const result = BattleEngine.resolveTurn(battle, attack, skip);

    // Burn damage
    expect(result.state.player.team[0].currentHp).toBe(94); // 100 - floor(100/16)
    // Attack reduction check: Normal damage without burn would be ~28. With burn 0.5x -> ~14
    const damageEvent = result.log.find(e => e.type === "DAMAGE");
    expect(damageEvent?.payload?.damage).toBeDefined();
    expect(damageEvent?.payload?.damage).toBeLessThan(20);
  });

  it("applies Intimidate on switch-in", () => {
    const p1 = mockPokemon("Pikachu");
    const p2 = mockPokemon("Gyarados", { ability: "Intimidate" });
    const o1 = mockPokemon("Opponent");
    const battle = createBattle([p1, p2], [o1]);

    const switchAction = { type: "SWITCH" as const, payload: { index: 1 } };
    const skip = { type: "SKIP" as const };

    const result = BattleEngine.resolveTurn(battle, switchAction, skip);

    expect(result.state.opponent.team[0].statChanges.atk).toBe(-1);
    expect(result.log.some(e => e.message.includes("Intimidate"))).toBe(true);
  });

  it("applies Stealth Rock damage on switch-in", () => {
    const p1 = mockPokemon("Pikachu");
    const p2 = mockPokemon("SwitchTarget");
    const o1 = mockPokemon("Opponent");
    const battle = createBattle([p1, p2], [o1]);
    battle.state.player.hazards.stealthRock = true;

    const switchAction = { type: "SWITCH" as const, payload: { index: 1 } };
    const skip = { type: "SKIP" as const };

    const result = BattleEngine.resolveTurn(battle, switchAction, skip);

    expect(result.state.player.team[1].currentHp).toBe(88); // 100 - 12 (1/8)
    expect(result.log.some(e => e.message.includes("stones"))).toBe(true);
  });

  it("respects Weather damage (Sandstorm)", () => {
    const p1 = mockPokemon("Caterpie"); // Not immune
    const o1 = mockPokemon("Sandslash", { types: ["Ground"] }); // Immune
    const battle = createBattle([p1], [o1]);
    battle.state.weather = { type: "SANDSTORM", turns: 5 };

    const skip = { type: "SKIP" as const };
    const result = BattleEngine.resolveTurn(battle, skip, skip);

    expect(result.state.player.team[0].currentHp).toBe(94);
    expect(result.state.opponent.team[0].currentHp).toBe(100);
  });

  it("triggers Life Orb damage after attacking", () => {
    const p1 = mockPokemon("Attacker", { item: "Life Orb" });
    const o1 = mockPokemon("Target");
    const battle = createBattle([p1], [o1]);

    const attack = {
        type: "ATTACK" as const,
        payload: { moveName: "Tackle", basePower: 40, type: "Normal", category: "PHYSICAL", accuracy: 100, priority: 0 }
    };
    const skip = { type: "SKIP" as const };

    const result = BattleEngine.resolveTurn(battle, attack, skip);

    expect(result.state.player.team[0].currentHp).toBe(90); // 100 - 10 (1/10)
    expect(result.log.some(e => e.message.includes("Life Orb"))).toBe(true);
  });
});
