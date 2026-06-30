import { describe, it, expect, beforeEach, vi } from "vitest";
import { useTeamStore } from "../store/team.store";
import { MAX_TEAM_SIZE } from "../constants/team.constants";

// Mock crypto.randomUUID
if (!global.crypto) {
  // @ts-ignore
  global.crypto = {};
}
// @ts-ignore
global.crypto.randomUUID = vi.fn(() => "test-uuid-" + Math.random());

describe("TeamStore", () => {
  beforeEach(() => {
    useTeamStore.setState({
      teams: {},
      teamOrder: [],
      activeTeamId: null,
    });
  });

  describe("createTeam", () => {
    it("should create a new team with a valid name", () => {
      const result = useTeamStore.getState().createTeam("Test Team");

      expect(result.ok).toBe(true);
      if (result.ok) {
        const team = useTeamStore.getState().teams[result.value];
        expect(team).toBeDefined();
        expect(team.name).toBe("Test Team");
        expect(useTeamStore.getState().teamOrder).toContain(result.value);
        expect(useTeamStore.getState().activeTeamId).toBe(result.value);
      }
    });

    it("should fail to create a team with an empty name", () => {
      const result = useTeamStore.getState().createTeam("  ");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("EMPTY_NAME");
      }
    });

    it("should fail to create a team with a duplicate name", () => {
      useTeamStore.getState().createTeam("Unique Name");
      const result = useTeamStore.getState().createTeam("Unique Name");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("DUPLICATE_NAME");
      }
    });
  });

  describe("deleteTeam", () => {
    it("should delete an existing team", () => {
      const createResult = useTeamStore.getState().createTeam("To Delete");
      if (createResult.ok) {
        const id = createResult.value;
        useTeamStore.getState().deleteTeam(id);
        expect(useTeamStore.getState().teams[id]).toBeUndefined();
        expect(useTeamStore.getState().teamOrder).not.toContain(id);
      }
    });

    it("should update activeTeamId when the active team is deleted", () => {
      const res1 = useTeamStore.getState().createTeam("Team 1");
      const res2 = useTeamStore.getState().createTeam("Team 2");

      if (res1.ok && res2.ok) {
        useTeamStore.getState().setActiveTeam(res1.value);
        useTeamStore.getState().deleteTeam(res1.value);
        expect(useTeamStore.getState().activeTeamId).toBe(res2.value);
      }
    });
  });

  describe("renameTeam", () => {
    it("should rename an existing team", () => {
      const createResult = useTeamStore.getState().createTeam("Old Name");
      if (createResult.ok) {
        const id = createResult.value;
        const result = useTeamStore.getState().renameTeam(id, "New Name");
        expect(result.ok).toBe(true);
        expect(useTeamStore.getState().teams[id].name).toBe("New Name");
      }
    });
  });

  describe("duplicateTeam", () => {
    it("should duplicate an existing team with a new name", () => {
      const createResult = useTeamStore.getState().createTeam("Original");
      if (createResult.ok) {
        const id = createResult.value;
        useTeamStore.getState().addPokemon(id, 25);

        const dupResult = useTeamStore.getState().duplicateTeam(id);
        expect(dupResult.ok).toBe(true);
        if (dupResult.ok) {
          const dupId = dupResult.value;
          expect(useTeamStore.getState().teams[dupId].name).toBe("Original Copy");
          expect(useTeamStore.getState().teams[dupId].pokemon).toContain(25);
        }
      }
    });
  });

  describe("pokemon operations", () => {
    it("should add pokemon to a team", () => {
      const createResult = useTeamStore.getState().createTeam("Team");
      if (createResult.ok) {
        const id = createResult.value;
        const result = useTeamStore.getState().addPokemon(id, 1);
        expect(result.ok).toBe(true);
        expect(useTeamStore.getState().teams[id].pokemon).toContain(1);
      }
    });

    it("should not allow duplicate pokemon in the same team", () => {
      const createResult = useTeamStore.getState().createTeam("Team");
      if (createResult.ok) {
        const id = createResult.value;
        useTeamStore.getState().addPokemon(id, 1);
        const result = useTeamStore.getState().addPokemon(id, 1);
        expect(result.ok).toBe(false);
        if (!result.ok) {
          expect(result.error).toBe("DUPLICATE_POKEMON");
        }
      }
    });

    it("should not allow more than MAX_TEAM_SIZE pokemon", () => {
      const createResult = useTeamStore.getState().createTeam("Team");
      if (createResult.ok) {
        const id = createResult.value;
        for (let i = 1; i <= MAX_TEAM_SIZE; i++) {
          useTeamStore.getState().addPokemon(id, i);
        }
        const result = useTeamStore.getState().addPokemon(id, 99);
        expect(result.ok).toBe(false);
        if (!result.ok) {
          expect(result.error).toBe("TEAM_FULL");
        }
      }
    });

    it("should remove pokemon from a team", () => {
      const createResult = useTeamStore.getState().createTeam("Team");
      if (createResult.ok) {
        const id = createResult.value;
        useTeamStore.getState().addPokemon(id, 1);
        const result = useTeamStore.getState().removePokemon(id, 1);
        expect(result.ok).toBe(true);
        expect(useTeamStore.getState().teams[id].pokemon).not.toContain(1);
      }
    });

    it("should move pokemon within a team", () => {
      const createResult = useTeamStore.getState().createTeam("Team");
      if (createResult.ok) {
        const id = createResult.value;
        useTeamStore.getState().addPokemon(id, 1); // index 0
        useTeamStore.getState().addPokemon(id, 2); // index 1
        useTeamStore.getState().addPokemon(id, 3); // index 2

        useTeamStore.getState().movePokemon(id, 2, 0);
        expect(useTeamStore.getState().teams[id].pokemon).toEqual([3, 1, 2]);
      }
    });
  });
});
