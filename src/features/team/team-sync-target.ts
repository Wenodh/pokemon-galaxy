import { useTeamStore } from "./store/team.store";
import { SyncTarget } from "@/features/cloud-sync/types/sync.types";
import { TEAM_STORE_VERSION } from "./constants/team.constants";
import { Team } from "./types/team.types";

interface TeamSyncData {
  teams: Record<string, Team>;
  teamOrder: string[];
}

export const teamSyncTarget: SyncTarget<TeamSyncData> = {
  featureId: "teams",

  getVersion: () => TEAM_STORE_VERSION,

  exportData: () => {
    const state = useTeamStore.getState();
    return {
      teams: state.teams,
      teamOrder: state.teamOrder,
    };
  },

  importData: (data) => {
    useTeamStore.setState({
      ...data,
      updatedAt: Date.now(),
    });
  },

  mergeData: (remoteData, remoteUpdatedAt) => {
    const localState = useTeamStore.getState();

    if (remoteUpdatedAt > localState.updatedAt) {
      useTeamStore.setState({
        ...remoteData,
        updatedAt: remoteUpdatedAt,
      });
    }
  },

  validateData: (data): data is TeamSyncData => {
    return (
      data &&
      typeof data === "object" &&
      "teams" in data &&
      "teamOrder" in data
    );
  },
};
