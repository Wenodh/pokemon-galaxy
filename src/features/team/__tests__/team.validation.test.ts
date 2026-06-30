import { describe, it, expect } from "vitest";
import {
  validateTeamName,
  validateAddPokemon,
  generateUniqueCopyName
} from "../utils/team.validation";
import { Team } from "../types/team.types";

describe("Team Validation Utilities", () => {
  const mockTeams: Team[] = [
    { id: "1", name: "Alpha", pokemon: [], createdAt: 0, updatedAt: 0 },
    { id: "2", name: "Beta", pokemon: [], createdAt: 0, updatedAt: 0 },
  ];

  describe("validateTeamName", () => {
    it("should succeed for unique non-empty name", () => {
      const result = validateTeamName("Gamma", mockTeams);
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.value).toBe("Gamma");
    });

    it("should fail for empty name", () => {
      const result = validateTeamName("   ", mockTeams);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("EMPTY_NAME");
    });

    it("should fail for duplicate name", () => {
      const result = validateTeamName("Alpha", mockTeams);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("DUPLICATE_NAME");
    });

    it("should succeed for duplicate name if it belongs to the same team (excludeId)", () => {
      const result = validateTeamName("Alpha", mockTeams, "1");
      expect(result.ok).toBe(true);
    });
  });

  describe("validateAddPokemon", () => {
    const team: Team = { id: "1", name: "Team", pokemon: [1, 2, 3], createdAt: 0, updatedAt: 0 };

    it("should succeed if pokemon is not in team and team is not full", () => {
      const result = validateAddPokemon(team, 4);
      expect(result.ok).toBe(true);
    });

    it("should fail if pokemon is already in team", () => {
      const result = validateAddPokemon(team, 1);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("DUPLICATE_POKEMON");
    });

    it("should fail if team is full", () => {
      const fullTeam: Team = { ...team, pokemon: [1, 2, 3, 4, 5, 6] };
      const result = validateAddPokemon(fullTeam, 7);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("TEAM_FULL");
    });
  });

  describe("generateUniqueCopyName", () => {
    it("should generate 'Name Copy' if unique", () => {
      const name = generateUniqueCopyName("Gamma", mockTeams);
      expect(name).toBe("Gamma Copy");
    });

    it("should generate 'Name Copy 2' if 'Name Copy' exists", () => {
      const teamsWithCopy = [...mockTeams, { id: "3", name: "Alpha Copy", pokemon: [], createdAt: 0, updatedAt: 0 }];
      const name = generateUniqueCopyName("Alpha", teamsWithCopy);
      expect(name).toBe("Alpha Copy 2");
    });
  });
});
