import { useSavedViewStore } from "./store/saved-views.store";
import { SyncTarget } from "@/features/cloud-sync/types/sync.types";
import { SavedView } from "./types/saved-view.types";

interface SavedViewsSyncData {
  views: Record<string, SavedView>;
  viewIds: string[];
}

export const savedViewsSyncTarget: SyncTarget<SavedViewsSyncData> = {
  featureId: "saved-views",

  getVersion: () => 1, // Store version is hardcoded in saved-views.store.ts as 1

  exportData: () => {
    const state = useSavedViewStore.getState();
    return {
      views: state.views,
      viewIds: state.viewIds,
    };
  },

  importData: (data) => {
    useSavedViewStore.setState({
      ...data,
      updatedAt: Date.now(),
    });
  },

  mergeData: (remoteData, remoteUpdatedAt) => {
    const localState = useSavedViewStore.getState();

    if (remoteUpdatedAt > localState.updatedAt) {
      useSavedViewStore.setState({
        ...remoteData,
        updatedAt: remoteUpdatedAt,
      });
    }
  },

  validateData: (data): data is SavedViewsSyncData => {
    return (
      data &&
      typeof data === "object" &&
      "views" in data &&
      "viewIds" in data
    );
  },
};
