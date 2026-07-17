export interface SyncMetadata {
  version: number;
  updatedAt: number; // timestamp
  deviceId: string;
}

export interface SyncPayload<T = any> extends SyncMetadata {
  data: T;
}

export type SyncStatus =
  | "never_synced"
  | "syncing"
  | "synced"
  | "offline"
  | "conflict"
  | "failed";

export interface SyncConflict {
  id: string;
  feature: string;
  localUpdatedAt: number;
  remoteUpdatedAt: number;
  resolution: "local" | "remote" | "pending";
  detectedAt: number;
}

export interface SyncTarget<T = any> {
  featureId: string;
  getVersion: () => number;
  exportData: () => T;
  importData: (data: T) => void;
  mergeData: (remoteData: T, remoteUpdatedAt: number) => void;
  validateData: (data: any) => data is T;
}
