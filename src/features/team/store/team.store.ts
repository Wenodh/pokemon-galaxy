import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TeamStore, Team } from "../types/team.types";
import { teamPersistOptions } from "./team.persist";
import {
  validateTeamName,
  validateAddPokemon,
  generateUniqueCopyName
} from "../utils/team.validation";
import { TEAM_STORE_VERSION } from "../constants/team.constants";

export const useTeamStore = create<TeamStore>()(
  persist(
    (set, get) => ({
      // State
      teams: {},
      teamOrder: [],
      activeTeamId: null,
      version: TEAM_STORE_VERSION,

      // Actions
      createTeam: (name) => {
        const validation = validateTeamName(name, Object.values(get().teams));
        if (!validation.ok) return validation;

        const newTeam: Team = {
          id: crypto.randomUUID(),
          name: validation.value,
          pokemon: [],
          competitive: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set((state) => ({
          teams: { ...state.teams, [newTeam.id]: newTeam },
          teamOrder: [...state.teamOrder, newTeam.id],
          activeTeamId: state.activeTeamId ?? newTeam.id,
        }));

        return { ok: true, value: newTeam.id };
      },

      deleteTeam: (id) => {
        set((state) => {
          const { [id]: _, ...remainingTeams } = state.teams;
          const newTeamOrder = state.teamOrder.filter((teamId) => teamId !== id);

          let newActiveTeamId = state.activeTeamId;
          if (state.activeTeamId === id) {
            newActiveTeamId = newTeamOrder.length > 0 ? newTeamOrder[0] : null;
          }

          return {
            teams: remainingTeams,
            teamOrder: newTeamOrder,
            activeTeamId: newActiveTeamId,
          };
        });
      },

      renameTeam: (id, newName) => {
        const team = get().teams[id];
        if (!team) return { ok: false, error: "TEAM_NOT_FOUND" };

        const validation = validateTeamName(newName, Object.values(get().teams), id);
        if (!validation.ok) return validation;

        set((state) => ({
          teams: {
            ...state.teams,
            [id]: {
              ...state.teams[id],
              name: (validation as { ok: true; value: string }).value,
              updatedAt: Date.now()
            },
          },
        }));

        return { ok: true, value: undefined };
      },

      duplicateTeam: (id) => {
        const team = get().teams[id];
        if (!team) return { ok: false, error: "TEAM_NOT_FOUND" };

        const newName = generateUniqueCopyName(team.name, Object.values(get().teams));

        const newTeam: Team = {
          ...team,
          id: crypto.randomUUID(),
          name: newName,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set((state) => ({
          teams: { ...state.teams, [newTeam.id]: newTeam },
          teamOrder: [...state.teamOrder, newTeam.id],
        }));

        return { ok: true, value: newTeam.id };
      },

      addPokemon: (teamId, pokemonId, competitive) => {
        const team = get().teams[teamId];
        if (!team) return { ok: false, error: "TEAM_NOT_FOUND" };

        const validation = validateAddPokemon(team, pokemonId);
        if (!validation.ok) return validation;

        set((state) => {
          const newPokemon = [...team.pokemon, pokemonId];
          const newCompetitive = team.competitive ? [...team.competitive] : [];

          if (competitive) {
              newCompetitive[newPokemon.length - 1] = competitive;
          }

          return {
            teams: {
              ...state.teams,
              [teamId]: {
                ...team,
                pokemon: newPokemon,
                competitive: newCompetitive,
                updatedAt: Date.now(),
              },
            },
          };
        });

        return { ok: true, value: undefined };
      },

      removePokemon: (teamId, pokemonId) => {
        const team = get().teams[teamId];
        if (!team) return { ok: false, error: "TEAM_NOT_FOUND" };

        const index = team.pokemon.indexOf(pokemonId);
        if (index === -1) {
          return { ok: false, error: "POKEMON_NOT_IN_TEAM" };
        }

        set((state) => {
          const newPokemon = [...team.pokemon];
          newPokemon.splice(index, 1);

          const newCompetitive = team.competitive ? [...team.competitive] : [];
          if (newCompetitive.length > 0) {
              newCompetitive.splice(index, 1);
          }

          return {
            teams: {
              ...state.teams,
              [teamId]: {
                ...team,
                pokemon: newPokemon,
                competitive: newCompetitive,
                updatedAt: Date.now(),
              },
            },
          };
        });

        return { ok: true, value: undefined };
      },

      movePokemon: (teamId, fromIndex, toIndex) => {
        const team = get().teams[teamId];
        if (!team) return { ok: false, error: "TEAM_NOT_FOUND" };

        if (
          fromIndex < 0 ||
          fromIndex >= team.pokemon.length ||
          toIndex < 0 ||
          toIndex >= team.pokemon.length
        ) {
          return { ok: true, value: undefined };
        }

        const newPokemon = [...team.pokemon];
        const [moved] = newPokemon.splice(fromIndex, 1);
        newPokemon.splice(toIndex, 0, moved);

        const newCompetitive = team.competitive ? [...team.competitive] : [];
        if (newCompetitive.length > 0) {
            const [movedComp] = newCompetitive.splice(fromIndex, 1);
            newCompetitive.splice(toIndex, 0, movedComp);
        }

        set((state) => ({
          teams: {
            ...state.teams,
            [teamId]: {
              ...team,
              pokemon: newPokemon,
              competitive: newCompetitive,
              updatedAt: Date.now(),
            },
          },
        }));

        return { ok: true, value: undefined };
      },

      clearTeam: (teamId) => {
        const team = get().teams[teamId];
        if (!team) return { ok: false, error: "TEAM_NOT_FOUND" };

        set((state) => ({
          teams: {
            ...state.teams,
            [teamId]: {
              ...team,
              pokemon: [],
              competitive: [],
              updatedAt: Date.now(),
            },
          },
        }));

        return { ok: true, value: undefined };
      },

      setActiveTeam: (id) => {
        if (id !== null && !get().teams[id]) return;
        set({ activeTeamId: id });
      },

      getTeam: (id) => get().teams[id],

      getAllTeams: () => {
        const { teams, teamOrder } = get();
        return teamOrder.map((id) => teams[id]);
      },
    }),
    teamPersistOptions
  )
);
