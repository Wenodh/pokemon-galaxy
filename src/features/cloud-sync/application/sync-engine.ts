import { CloudProvider, MockCloudProvider } from "../infrastructure/cloud-provider";
import { useSyncQueueStore, SyncOperation } from "../store/sync-queue.store";
import { useSyncStore } from "../store/sync.store";
import { SyncTarget, SyncPayload } from "../types/sync.types";
import { getDeviceId } from "../utils/device-id";
import { favoritesSyncTarget } from "../../favorites/sync-target";
import { trainerSyncTarget } from "../../trainer/sync-target";
import { livingDexSyncTarget } from "../../collections/living-dex-sync-target";
import { collectionsSyncTarget } from "../../collections/collections-sync-target";
import { teamSyncTarget } from "../../team/team-sync-target";
import { savedViewsSyncTarget } from "../../saved-views/saved-views-sync-target";

export class SyncEngine {
  private static instance: SyncEngine;
  private provider: CloudProvider;
  private targets: Map<string, SyncTarget>;
  private isProcessing: boolean = false;

  private constructor() {
    this.provider = new MockCloudProvider();
    this.targets = new Map();
    this.registerTargets();
  }

  static getInstance() {
    if (!SyncEngine.instance) {
      SyncEngine.instance = new SyncEngine();
    }
    return SyncEngine.instance;
  }

  private registerTargets() {
    [
      favoritesSyncTarget,
      trainerSyncTarget,
      livingDexSyncTarget,
      collectionsSyncTarget,
      teamSyncTarget,
      savedViewsSyncTarget,
    ].forEach((target) => {
      this.targets.set(target.featureId, target);
    });
  }

  async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    const queueStore = useSyncQueueStore.getState();
    const syncStore = useSyncStore.getState();

    if (!syncStore.isEnabled) {
        this.isProcessing = false;
        return;
    }

    try {
      let operation = queueStore.getNextOperation();
      while (operation) {
        await this.executeOperation(operation);
        operation = queueStore.getNextOperation();
      }

      if (syncStore.status === "syncing") {
        syncStore.setStatus("synced");
        syncStore.setLastSyncedAt(Date.now());
      }
    } catch (error) {
      console.error("SyncEngine processQueue failed", error);
      syncStore.setStatus("failed");
    } finally {
      this.isProcessing = false;
    }
  }

  private async executeOperation(operation: SyncOperation) {
    const queueStore = useSyncQueueStore.getState();
    const target = this.targets.get(operation.featureId);

    if (!target) {
      queueStore.removeOperation(operation.id);
      return;
    }

    queueStore.updateOperation(operation.id, {
      status: "processing",
      attempts: operation.attempts + 1,
      lastAttempt: Date.now(),
    });

    try {
      if (operation.type === "PUSH") {
        const data = target.exportData();
        const payload: SyncPayload = {
          data,
          version: target.getVersion(),
          updatedAt: Date.now(), // This should ideally be the store's updatedAt
          deviceId: getDeviceId(),
        };
        await this.provider.push(operation.featureId, payload);
      } else {
        const payload = await this.provider.pull(operation.featureId);
        if (payload) {
          target.mergeData(payload.data, payload.updatedAt);
        }
      }

      queueStore.removeOperation(operation.id);
    } catch (error: any) {
      console.error(`Operation ${operation.id} failed`, error);

      if (error.message === "CONFLICT") {
        this.handleConflict(operation);
      } else {
        queueStore.updateOperation(operation.id, {
          status: "failed",
          error: error.message,
        });
      }
      throw error;
    }
  }

  private async handleConflict(operation: SyncOperation) {
    const syncStore = useSyncStore.getState();
    const remotePayload = await this.provider.pull(operation.featureId);

    if (remotePayload) {
      syncStore.addConflict({
        id: crypto.randomUUID(),
        feature: operation.featureId,
        localUpdatedAt: Date.now(), // Should be local store's updatedAt
        remoteUpdatedAt: remotePayload.updatedAt,
        resolution: "pending",
        detectedAt: Date.now(),
      });
    }
  }

  async triggerSync() {
    const syncStore = useSyncStore.getState();
    if (!syncStore.isEnabled) return;

    syncStore.setStatus("syncing");

    // Add PULL and PUSH operations for all targets
    const queueStore = useSyncQueueStore.getState();
    this.targets.forEach((_, featureId) => {
      queueStore.addOperation(featureId, "PULL");
      queueStore.addOperation(featureId, "PUSH");
    });

    this.processQueue();
  }
}
