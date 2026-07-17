import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SyncOperation {
  id: string;
  featureId: string;
  type: "PUSH" | "PULL";
  status: "pending" | "processing" | "failed" | "completed";
  attempts: number;
  lastAttempt?: number;
  error?: string;
  createdAt: number;
}

interface SyncQueueState {
  operations: SyncOperation[];
  isPaused: boolean;

  addOperation: (featureId: string, type: "PUSH" | "PULL") => void;
  updateOperation: (id: string, updates: Partial<SyncOperation>) => void;
  removeOperation: (id: string) => void;
  getNextOperation: () => SyncOperation | undefined;
  setPaused: (paused: boolean) => void;
  clearQueue: () => void;
}

export const useSyncQueueStore = create<SyncQueueState>()(
  persist(
    (set, get) => ({
      operations: [],
      isPaused: false,

      addOperation: (featureId, type) => {
        // Prevent duplicate pending operations of same type for same feature
        const exists = get().operations.find(
          (op) => op.featureId === featureId && op.type === type && op.status === "pending"
        );
        if (exists) return;

        const newOp: SyncOperation = {
          id: crypto.randomUUID(),
          featureId,
          type,
          status: "pending",
          attempts: 0,
          createdAt: Date.now(),
        };

        set((state) => ({
          operations: [...state.operations, newOp],
        }));
      },

      updateOperation: (id, updates) => {
        set((state) => ({
          operations: state.operations.map((op) =>
            op.id === id ? { ...op, ...updates } : op
          ),
        }));
      },

      removeOperation: (id) => {
        set((state) => ({
          operations: state.operations.filter((op) => op.id !== id),
        }));
      },

      getNextOperation: () => {
        const { operations, isPaused } = get();
        if (isPaused) return undefined;

        return operations.find((op) => op.status === "pending" || op.status === "failed");
      },

      setPaused: (paused) => set({ isPaused: paused }),

      clearQueue: () => set({ operations: [] }),
    }),
    {
      name: "pokemon-sync-queue",
    }
  )
);
