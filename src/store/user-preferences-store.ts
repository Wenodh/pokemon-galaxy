import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  language: string;
  setReducedMotion: (enabled: boolean) => void;
  setHighContrast: (enabled: boolean) => void;
  setLanguage: (lang: string) => void;
}

export const useUserPreferencesStore = create<UserPreferences>()(
  persist(
    (set) => ({
      reducedMotion: false,
      highContrast: false,
      language: "en",
      setReducedMotion: (enabled) => set({ reducedMotion: enabled }),
      setHighContrast: (enabled) => set({ highContrast: enabled }),
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: "user-preferences-storage",
    }
  )
);
