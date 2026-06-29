import { useShallow } from "zustand/react/shallow";
import { useTeamStore } from "../store/team.store";
import { selectAllTeams } from "../store/team.selectors";

export const useTeams = () => {
  const teams = useTeamStore(selectAllTeams);
  const {
    createTeam,
    deleteTeam,
    renameTeam,
    duplicateTeam,
    getAllTeams,
    getTeam,
  } = useTeamStore(
    useShallow((state) => ({
      createTeam: state.createTeam,
      deleteTeam: state.deleteTeam,
      renameTeam: state.renameTeam,
      duplicateTeam: state.duplicateTeam,
      getAllTeams: state.getAllTeams,
      getTeam: state.getTeam,
    }))
  );

  return {
    teams,
    createTeam,
    deleteTeam,
    renameTeam,
    duplicateTeam,
    getAllTeams,
    getTeam,
  };
};
