import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RecentlyViewedStore } from "../types/recently-viewed.types";
import {
  RECENTLY_VIEWED_STORAGE_KEY,
  RECENTLY_VIEWED_STORE_VERSION,
  MAX_RECENT_ITEMS
} from "../constants/recently-viewed.constants";

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      // State
      recentIds: [],
      version: RECENTLY_VIEWED_STORE_VERSION,

      // Actions
      addRecent: (id) => {
        if (!id || id <= 0) return;

        set((state) => {
          // Remove if already exists to move it to the top
          const filtered = state.recentIds.filter((recentId) => recentId !== id);
          const updated = [id, ...filtered].slice(0, MAX_RECENT_ITEMS);

          return { recentIds: updated };
        });
      },

      clearHistory: () => set({ recentIds: [] }),

      getRecentCount: () => get().recentIds.length,
    }),
    {
      name: RECENTLY_VIEWED_STORAGE_KEY,
      version: RECENTLY_VIEWED_STORE_VERSION,
      partialize: (state) => ({
        recentIds: state.recentIds,
        version: state.version,
      }),
    }
  )
);
