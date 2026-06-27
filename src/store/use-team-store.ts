import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TeamMember {
  id: number;
  name: string;
  types: string[];
}

interface TeamStore {
  currentTeam: TeamMember[];
  addToTeam: (pokemon: TeamMember) => void;
  removeFromTeam: (id: number) => void;
  clearTeam: () => void;
}

export const useTeamStore = create<TeamStore>()(
  persist(
    (set) => ({
      currentTeam: [],
      addToTeam: (pokemon) =>
        set((state) => {
          if (state.currentTeam.length >= 6) return state;
          if (state.currentTeam.find((p) => p.id === pokemon.id)) return state;
          return { currentTeam: [...state.currentTeam, pokemon] };
        }),
      removeFromTeam: (id) =>
        set((state) => ({
          currentTeam: state.currentTeam.filter((p) => p.id !== id),
        })),
      clearTeam: () => set({ currentTeam: [] }),
    }),
    {
      name: 'pokemon-team-storage',
    }
  )
);
