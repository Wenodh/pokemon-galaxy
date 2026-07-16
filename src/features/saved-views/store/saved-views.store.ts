import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { SavedView, SavedViewStoreState, SavedViewActions } from "../types/saved-view.types";
import { useSyncQueueStore } from "../../cloud-sync/store/sync-queue.store";

const MAX_NAME_LENGTH = 40;

interface SavedViewStore extends SavedViewStoreState, SavedViewActions {}

export const useSavedViewStore = create<SavedViewStore>()(
  persist(
    (set, get) => ({
      views: {},
      viewIds: [],
      activeViewId: null,
      updatedAt: Date.now(),

      saveView: (viewData) => {
        const name = viewData.name.trim();

        // Validation
        if (!name) {
          return { success: false, error: "Name cannot be empty" };
        }

        if (name.length > MAX_NAME_LENGTH) {
          return { success: false, error: `Name cannot exceed ${MAX_NAME_LENGTH} characters` };
        }

        const state = get();
        const normalizedName = name.toLowerCase();

        // Check for duplicate names (case-insensitive)
        const isDuplicate = Object.values(state.views).some(
          (v) => v.name.toLowerCase() === normalizedName && v.id !== viewData.id
        );

        if (isDuplicate) {
          return { success: false, error: "A view with this name already exists" };
        }

        const now = Date.now();
        const id = viewData.id || crypto.randomUUID();

        const newView: SavedView = {
          ...viewData,
          id,
          name,
          createdAt: state.views[id]?.createdAt || now,
          updatedAt: now,
        };

        set((state) => ({
          views: {
            ...state.views,
            [id]: newView,
          },
          viewIds: state.views[id] ? state.viewIds : [...state.viewIds, id],
          activeViewId: id,
          updatedAt: now,
        }));

        useSyncQueueStore.getState().addOperation("saved-views", "PUSH");

        return { success: true };
      },

      deleteView: (id) => {
        set((state) => {
          const { [id]: _, ...remainingViews } = state.views;
          return {
            views: remainingViews,
            viewIds: state.viewIds.filter((viewId) => viewId !== id),
            activeViewId: state.activeViewId === id ? null : state.activeViewId,
            updatedAt: Date.now(),
          };
        });
      },

      duplicateView: (id) => {
        const state = get();
        const originalView = state.views[id];
        if (!originalView) return;

        let newName = `${originalView.name} (Copy)`;
        let counter = 1;

        // Ensure unique name for duplicate
        while (Object.values(state.views).some(v => v.name.toLowerCase() === newName.toLowerCase())) {
          newName = `${originalView.name} (Copy ${++counter})`;
        }

        const newId = crypto.randomUUID();
        const now = Date.now();

        const duplicatedView: SavedView = {
          ...originalView,
          id: newId,
          name: newName,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          views: {
            ...state.views,
            [newId]: duplicatedView,
          },
          viewIds: [...state.viewIds, newId],
        }));
      },

      applyView: (id) => {
        set({ activeViewId: id });
      },

      renameView: (id, newName) => {
        const name = newName.trim();
        if (!name) return { success: false, error: "Name cannot be empty" };
        if (name.length > MAX_NAME_LENGTH) return { success: false, error: `Name cannot exceed ${MAX_NAME_LENGTH} characters` };

        const state = get();
        const normalizedName = name.toLowerCase();

        const isDuplicate = Object.values(state.views).some(
          (v) => v.name.toLowerCase() === normalizedName && v.id !== id
        );

        if (isDuplicate) {
          return { success: false, error: "A view with this name already exists" };
        }

        const existingView = state.views[id];
        if (!existingView) return { success: false, error: "View not found" };

        set((state) => ({
          views: {
            ...state.views,
            [id]: {
              ...existingView,
              name,
              updatedAt: Date.now(),
            },
          },
        }));

        return { success: true };
      },
    }),
    {
      name: "pokemon-saved-views",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
