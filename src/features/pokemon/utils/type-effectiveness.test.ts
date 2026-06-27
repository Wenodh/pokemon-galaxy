import { describe, it, expect } from "vitest";
import { calculateTypeEffectiveness } from "./type-effectiveness";

describe("calculateTypeEffectiveness", () => {
  it("calculates effectiveness for single type (Fire)", () => {
    const result = calculateTypeEffectiveness(["fire"]);

    // Weaknesses: Water, Ground, Rock
    expect(result.weaknesses.some(w => w.type === "water" && w.multiplier === 2)).toBe(true);
    expect(result.weaknesses.some(w => w.type === "ground" && w.multiplier === 2)).toBe(true);
    expect(result.weaknesses.some(w => w.type === "rock" && w.multiplier === 2)).toBe(true);

    // Resistances: Fire, Grass, Ice, Bug, Steel, Fairy
    expect(result.resistances.some(r => r.type === "fire" && r.multiplier === 0.5)).toBe(true);
    expect(result.resistances.some(r => r.type === "grass" && r.multiplier === 0.5)).toBe(true);
  });

  it("calculates effectiveness for dual type (Charizard: Fire/Flying)", () => {
    const result = calculateTypeEffectiveness(["fire", "flying"]);

    // 4x Weakness to Rock
    expect(result.weaknesses.some(w => w.type === "rock" && w.multiplier === 4)).toBe(true);

    // 2x Weakness to Water, Electric
    expect(result.weaknesses.some(w => w.type === "water" && w.multiplier === 2)).toBe(true);
    expect(result.weaknesses.some(w => w.type === "electric" && w.multiplier === 2)).toBe(true);

    // Immunity to Ground
    expect(result.immunities.some(i => i.type === "ground")).toBe(true);

    // Resistance to Fighting (0.5 * 0.5 = 0.25)
    // Actually Fire is neutral to Fighting, Flying resists Fighting. So 0.5x.
    // Wait, let's check chart:
    // fighting vs fire: 1x
    // fighting vs flying: 0.5x
    // Result: 0.5x
    expect(result.resistances.some(r => r.type === "fighting" && r.multiplier === 0.5)).toBe(true);

    // Grass: fire resists (0.5), flying resists (0.5) -> 0.25x
    expect(result.resistances.some(r => r.type === "grass" && r.multiplier === 0.25)).toBe(true);
  });

  it("handles immunities correctly (Gastly: Ghost/Poison)", () => {
    const result = calculateTypeEffectiveness(["ghost", "poison"]);

    // Immune to Normal, Fighting
    expect(result.immunities.some(i => i.type === "normal")).toBe(true);
    expect(result.immunities.some(i => i.type === "fighting")).toBe(true);
  });
});
