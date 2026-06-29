"use client";

import { useShallow } from "zustand/react/shallow";
import { useTeamStore } from "../store/team.store";
import { selectActiveTeam } from "../store/team.selectors";

export const useActiveTeam = () => {
  const activeTeam = useTeamStore(useShallow(selectActiveTeam));
  const activeTeamId = useTeamStore((state) => state.activeTeamId);

  const {
    setActiveTeam,
    addPokemon,
    removePokemon,
    movePokemon,
    clearTeam,
  } = useTeamStore(
    useShallow((state) => ({
      setActiveTeam: state.setActiveTeam,
      addPokemon: state.addPokemon,
      removePokemon: state.removePokemon,
      movePokemon: state.movePokemon,
      clearTeam: state.clearTeam,
    }))
  );

  return {
    activeTeam,
    activeTeamId,
    setActiveTeam,
    addPokemon,
    removePokemon,
    movePokemon,
    clearTeam,
  };
};
