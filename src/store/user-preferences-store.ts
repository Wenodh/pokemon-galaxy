import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CardDensity = "comfortable" | "compact";

interface UserPreferencesState {
  reducedMotion: boolean;
  cardDensity: CardDensity;
  setReducedMotion: (enabled: boolean) => void;
  setCardDensity: (density: CardDensity) => void;
}

export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    (set) => ({
      reducedMotion: false,
      cardDensity: "comfortable",
      setReducedMotion: (enabled) => set({ reducedMotion: enabled }),
      setCardDensity: (density) => set({ cardDensity: density }),
    }),
    {
      name: "user-preferences-storage",
    }
  )
);
