import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { toast } from "sonner";
import { TrainerProfile, TimelineEvent, TrainerMetric, TrainerEvent } from "../types";
import { TRAINER_STORAGE_KEY, TRAINER_STORE_VERSION, MILESTONES_LIST } from "../constants";
import { ACHIEVEMENTS_REGISTRY } from "../constants/achievements";
import { TrainerEventService } from "../application/event-service";
import { TrainerStatisticsService } from "../application/statistics-service";
import { useSyncQueueStore } from "../../cloud-sync/store/sync-queue.store";

interface TrainerState {
  // Core Profile Info
  profile: TrainerProfile;
  timeline: TimelineEvent[];
  viewedPokemonSet: number[]; // Store viewed pokemon IDs
  exportedCount: number;
  importedCount: number;
  teamAnalysesCount: number;

  // Actions
  updateProfile: (updates: Partial<Omit<TrainerProfile, "id" | "createdAt" | "updatedAt" | "completedMilestones" | "completedAchievements">>) => void;
  addTimelineEvent: (
    type: TimelineEvent["type"],
    title: string,
    description: string,
    metadata?: Record<string, any>
  ) => void;
  clearProfile: () => void;
  evaluateProgress: (metric?: TrainerMetric) => void;
}

const defaultProfile = (): TrainerProfile => ({
  id: crypto.randomUUID(),
  name: "Red",
  avatarStyle: "initials",
  avatarColor: "bg-red-500",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  completedMilestones: [],
  completedAchievements: {},
});

const trainerPersistOptions: PersistOptions<TrainerState, any> = {
  name: TRAINER_STORAGE_KEY,
  version: TRAINER_STORE_VERSION,
  partialize: (state) => ({
    profile: state.profile,
    timeline: state.timeline,
    viewedPokemonSet: state.viewedPokemonSet,
    exportedCount: state.exportedCount,
    importedCount: state.importedCount,
    teamAnalysesCount: state.teamAnalysesCount,
  }),
};

export const useTrainerStore = create<TrainerState>()(
  persist(
    (set, get) => {
      // Internal function to check achievements & milestones and trigger side effects
      const evaluateProgress = (metric?: TrainerMetric) => {
        const state = get();
        const now = Date.now();
        const stats = TrainerStatisticsService.getStatistics(
          state.viewedPokemonSet.length,
          state.exportedCount,
          state.importedCount,
          state.teamAnalysesCount
        );

        console.log("Stats Evaluated for metric:", metric, stats);

        // 1. Evaluate config-driven Achievements
        let achievementsUpdated = false;
        const currentCompleted = { ...state.profile.completedAchievements };

        ACHIEVEMENTS_REGISTRY.forEach((ach) => {
          // If already completed, skip
          if (currentCompleted[ach.id]) return;

          // Retrieve active progress for this metric
          const value = stats[ach.metric];
          console.log(`Checking Achievement: ${ach.id} (metric: ${ach.metric}, val: ${value}, target: ${ach.target})`);
          if (value >= ach.target) {
            currentCompleted[ach.id] = now;
            achievementsUpdated = true;

            // Notify user with elegant toast
            try {
              toast.success(`Achievement Unlocked! 🏆`, {
                description: `${ach.title}: ${ach.description}`,
              });
            } catch (e) {
              // Prevent testing environments without toast configuration from failing
            }

            // Log to timeline
            state.addTimelineEvent(
              "ACHIEVEMENT_UNLOCKED",
              `Unlocked "${ach.title}"`,
              `Completed achievement for ${ach.description}`,
              { achievementId: ach.id }
            );
          }
        });

        // 2. Evaluate Living Dex Milestones (10, 25, 50, 75, 90, 100 %)
        let milestonesUpdated = false;
        const currentMilestones = [...state.profile.completedMilestones];
        const livingDexComp = stats.livingDexCompletion;

        MILESTONES_LIST.forEach((percent) => {
          if (currentMilestones.includes(percent)) return;

          if (livingDexComp >= percent) {
            currentMilestones.push(percent);
            milestonesUpdated = true;

            // Notify user
            try {
              toast.success(`Milestone Achieved! 🎉`, {
                description: `Reached ${percent}% of Living Pokédex completion!`,
              });
            } catch (e) {
              // Prevent testing environments from failing
            }

            // Log to timeline
            state.addTimelineEvent(
              "MILESTONE_REACHED",
              `${percent}% Living Dex Completed`,
              `Congratulations! You have registered ${stats.pokemonCaught} out of 1025 species.`,
              { percentage: percent }
            );
          }
        });

        // Save progress state if any changes happened
        if (achievementsUpdated || milestonesUpdated) {
          set((prev) => ({
            profile: {
              ...prev.profile,
              completedAchievements: currentCompleted,
              completedMilestones: currentMilestones,
              updatedAt: now,
            },
          }));
          useSyncQueueStore.getState().addOperation("trainer", "PUSH");
        }
      };

      // Subscribe immediately to the TrainerEventService to handle loosely-coupled actions
      TrainerEventService.subscribe((event: TrainerEvent) => {
        const state = get();

        switch (event.type) {
          case "COLLECTION_CREATED":
            state.addTimelineEvent(
              "COLLECTION_CREATED",
              `Collection Created: ${event.name}`,
              `You created a new custom collection.`,
              { collectionId: event.collectionId }
            );
            evaluateProgress("collectionsCreated");
            break;

          case "POKEMON_CAUGHT":
            state.addTimelineEvent(
              "POKEMON_CAUGHT",
              `Caught ${event.name}`,
              `Successfully added ${event.name} (#${String(event.id).padStart(4, "0")}) to your Living Pokédex.`,
              { pokemonId: event.id }
            );
            evaluateProgress("pokemonCaught");
            break;

          case "POKEMON_SEEN":
            state.addTimelineEvent(
              "POKEMON_SEEN",
              `Encountered ${event.name}`,
              `Recorded seeing ${event.name} (#${String(event.id).padStart(4, "0")}) in the wild.`,
              { pokemonId: event.id }
            );
            evaluateProgress("pokemonSeen");
            break;

          case "TEAM_CREATED":
            state.addTimelineEvent(
              "TEAM_CREATED",
              `Team Assembled: ${event.name}`,
              `Formed a new custom roster inside the Team Builder.`,
              { teamId: event.teamId }
            );
            evaluateProgress("teamsCreated");
            break;

          case "TEAM_DUPLICATED":
            state.addTimelineEvent(
              "TEAM_CREATED", // Re-use timeline event mapping structure or can log as TEAM_CREATED
              `Team Duplicated: ${event.name}`,
              `Duplicated a team roster inside the Team Builder.`,
              { teamId: event.teamId }
            );
            evaluateProgress("teamsCreated");
            break;

          case "TEAM_IMPORTED":
            state.addTimelineEvent(
              "TEAM_CREATED",
              `Team Imported: ${event.name}`,
              `Imported a new team roster from a text setup.`,
              { teamId: event.teamId }
            );
            evaluateProgress("teamsCreated");
            break;

          case "TEAM_ANALYZED":
            set((prev) => ({
              teamAnalysesCount: prev.teamAnalysesCount + 1,
              profile: { ...prev.profile, updatedAt: Date.now() },
            }));
            state.addTimelineEvent(
              "TEAM_ANALYZED",
              `Analyzed "${event.name}"`,
              `Executed competitive balance and type coverage analysis. Rating Score: ${event.score}/100.`
            );
            evaluateProgress("teamAnalyses");
            break;

          case "FAVORITE_ADDED":
            state.addTimelineEvent(
              "FAVORITE_ADDED",
              `Favorited ${event.name}`,
              `Added ${event.name} (#${String(event.id).padStart(4, "0")}) to your Favorites list.`,
              { pokemonId: event.id }
            );
            evaluateProgress("favoritesCount");
            break;

          case "FAVORITE_REMOVED":
            state.addTimelineEvent(
              "FAVORITE_ADDED", // Symmetrical timeline event mapping
              `Removed Favorite: ${event.name}`,
              `Removed ${event.name} (#${String(event.id).padStart(4, "0")}) from your Favorites list.`,
              { pokemonId: event.id }
            );
            evaluateProgress("favoritesCount");
            break;

          case "POKEMON_VIEWED":
            const viewedSet = [...state.viewedPokemonSet];
            if (!viewedSet.includes(event.id)) {
              viewedSet.push(event.id);
              set((prev) => ({
                viewedPokemonSet: viewedSet,
                profile: { ...prev.profile, updatedAt: Date.now() },
              }));
              evaluateProgress("viewedPokemon");
            }
            break;

          case "COLLECTION_EXPORTED":
            set((prev) => ({
              exportedCount: prev.exportedCount + 1,
              profile: { ...prev.profile, updatedAt: Date.now() },
            }));
            evaluateProgress("exportedCollections");
            break;

          case "COLLECTION_IMPORTED":
            set((prev) => ({
              importedCount: prev.importedCount + 1,
              profile: { ...prev.profile, updatedAt: Date.now() },
            }));
            evaluateProgress("importedCollections");
            break;
        }
      });

      return {
        // State
        profile: defaultProfile(),
        timeline: [],
        viewedPokemonSet: [],
        exportedCount: 0,
        importedCount: 0,
        teamAnalysesCount: 0,

        // Actions
        updateProfile: (updates) => {
          set((state) => ({
            profile: {
              ...state.profile,
              ...updates,
              updatedAt: Date.now(),
            },
          }));
          useSyncQueueStore.getState().addOperation("trainer", "PUSH");
        },

        addTimelineEvent: (type, title, description, metadata) => {
          const now = Date.now();
          const newEvent: TimelineEvent = {
            id: crypto.randomUUID(),
            type,
            title,
            description,
            timestamp: now,
            metadata,
          };

          set((state) => ({
            timeline: [newEvent, ...state.timeline].slice(0, 200), // Limit timeline to 200 items for scaling
            profile: { ...state.profile, updatedAt: now },
          }));
          useSyncQueueStore.getState().addOperation("trainer", "PUSH");
        },

        evaluateProgress: (metric) => {
          evaluateProgress(metric);
        },

        clearProfile: () => {
          set({
            profile: defaultProfile(),
            timeline: [],
            viewedPokemonSet: [],
            exportedCount: 0,
            importedCount: 0,
            teamAnalysesCount: 0,
          });
        },
      };
    },
    trainerPersistOptions
  )
);

export const evaluateTrainerProgress = (metric?: TrainerMetric) => {
  useTrainerStore.getState().evaluateProgress(metric);
};
