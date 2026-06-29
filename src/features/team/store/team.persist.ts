import { PersistOptions } from "zustand/middleware";
import { TeamState, TeamStore } from "../types/team.types";
import { TEAM_STORAGE_KEY, TEAM_STORE_VERSION } from "../constants/team.constants";

export const teamPersistOptions: PersistOptions<TeamStore, TeamState> = {
  name: TEAM_STORAGE_KEY,
  version: TEAM_STORE_VERSION,
  partialize: (state) => ({
    teams: state.teams,
    teamOrder: state.teamOrder,
    activeTeamId: state.activeTeamId,
    version: state.version,
  }),
  migrate: (persistedState: unknown, version: number) => {
    if (version < TEAM_STORE_VERSION) {
      // Future migrations go here
    }
    return persistedState as TeamState;
  },
};
