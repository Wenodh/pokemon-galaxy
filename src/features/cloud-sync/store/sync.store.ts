import { create } from "zustand";
import { SyncStatus, SyncConflict } from "../types/sync.types";

interface SyncState {
  status: SyncStatus;
  lastSyncedAt?: number;
  conflicts: SyncConflict[];
  isEnabled: boolean;

  setStatus: (status: SyncStatus) => void;
  setLastSyncedAt: (timestamp: number) => void;
  addConflict: (conflict: SyncConflict) => void;
  resolveConflict: (id: string, resolution: "local" | "remote") => void;
  setEnabled: (enabled: boolean) => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  status: "never_synced",
  conflicts: [],
  isEnabled: false,

  setStatus: (status) => set({ status }),
  setLastSyncedAt: (lastSyncedAt) => set({ lastSyncedAt }),
  addConflict: (conflict) => set((state) => ({
    conflicts: [conflict, ...state.conflicts],
    status: "conflict"
  })),
  resolveConflict: (id, resolution) => set((state) => ({
    conflicts: state.conflicts.map(c => c.id === id ? { ...c, resolution } : c)
  })),
  setEnabled: (enabled) => set({ isEnabled: enabled }),
}));
