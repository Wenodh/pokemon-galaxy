/**
 * A simple seeded pseudo-random number generator (PRNG) using LCG.
 * Used for deterministic battle simulation.
 */
export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  /**
   * Generates the next pseudo-random number and updates the seed.
   * Returns a value between 0 (inclusive) and 1 (exclusive).
   */
  next(): number {
    // Parameters for LCG (Linear Congruential Generator)
    // Using values from Numerical Recipes
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }

  /**
   * Returns a random integer between min (inclusive) and max (inclusive).
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Returns the current seed.
   */
  getSeed(): number {
    return this.seed;
  }
}
