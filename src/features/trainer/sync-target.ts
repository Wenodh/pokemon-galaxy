import { useTrainerStore } from "./store/trainer.store";
import { SyncTarget } from "@/features/cloud-sync/types/sync.types";
import { TRAINER_STORE_VERSION } from "./constants";
import { TrainerProfile, TimelineEvent } from "./types";

interface TrainerSyncData {
  profile: TrainerProfile;
  timeline: TimelineEvent[];
  viewedPokemonSet: number[];
  exportedCount: number;
  importedCount: number;
  teamAnalysesCount: number;
}

export const trainerSyncTarget: SyncTarget<TrainerSyncData> = {
  featureId: "trainer",

  getVersion: () => TRAINER_STORE_VERSION,

  exportData: () => {
    const state = useTrainerStore.getState();
    return {
      profile: state.profile,
      timeline: state.timeline,
      viewedPokemonSet: state.viewedPokemonSet,
      exportedCount: state.exportedCount,
      importedCount: state.importedCount,
      teamAnalysesCount: state.teamAnalysesCount,
    };
  },

  importData: (data) => {
    useTrainerStore.setState({
      ...data,
    });
  },

  mergeData: (remoteData, remoteUpdatedAt) => {
    const localState = useTrainerStore.getState();

    if (remoteUpdatedAt > localState.profile.updatedAt) {
      useTrainerStore.setState({
        ...remoteData,
      });
    }
  },

  validateData: (data): data is TrainerSyncData => {
    return (
      data &&
      typeof data === "object" &&
      "profile" in data &&
      "timeline" in data &&
      Array.isArray(data.timeline)
    );
  },
};
