import { TeamStore, Team } from "../types/team.types";

export const selectTeams = (state: TeamStore) => state.teams;
export const selectTeamOrder = (state: TeamStore) => state.teamOrder;
export const selectActiveTeamId = (state: TeamStore) => state.activeTeamId;

export const selectAllTeams = (state: TeamStore): Team[] => {
  const { teams, teamOrder } = state;
  // Use a stable reference if possible or ensure this is memoized in components
  return teamOrder.map((id) => teams[id]);
};

export const selectActiveTeam = (state: TeamStore): Team | null => {
  const { teams, activeTeamId } = state;
  return activeTeamId ? teams[activeTeamId] : null;
};

export const selectTeamById = (id: string) => (state: TeamStore): Team | undefined =>
  state.teams[id];
