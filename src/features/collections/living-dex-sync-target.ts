import { useLivingDexStore } from "./store/living-dex.store";
import { SyncTarget } from "@/features/cloud-sync/types/sync.types";
import { LIVING_DEX_STORE_VERSION } from "./constants";
import { LivingDexEntry } from "./types";

interface LivingDexSyncData {
  entries: Record<number, LivingDexEntry>;
  currentStreak?: number;
  longestStreak?: number;
}

export const livingDexSyncTarget: SyncTarget<LivingDexSyncData> = {
  featureId: "living-dex",

  getVersion: () => LIVING_DEX_STORE_VERSION,

  exportData: () => {
    const state = useLivingDexStore.getState();
    return {
      entries: state.entries,
      currentStreak: state.currentStreak,
      longestStreak: state.longestStreak,
    };
  },

  importData: (data) => {
    useLivingDexStore.setState({
      ...data,
      updatedAt: Date.now(),
    });
  },

  mergeData: (remoteData, remoteUpdatedAt) => {
    const localState = useLivingDexStore.getState();

    if (remoteUpdatedAt > localState.updatedAt) {
      useLivingDexStore.setState({
        ...remoteData,
        updatedAt: remoteUpdatedAt,
      });
    }
  },

  validateData: (data): data is LivingDexSyncData => {
    return data && typeof data === "object" && "entries" in data;
  },
};
