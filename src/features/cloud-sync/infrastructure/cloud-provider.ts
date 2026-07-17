import { SyncPayload } from "../types/sync.types";

export interface CloudProvider {
  push(featureId: string, payload: SyncPayload): Promise<void>;
  pull(featureId: string): Promise<SyncPayload | null>;
  listChanges(since: number): Promise<string[]>; // returns featureIds
}

export class MockCloudProvider implements CloudProvider {
  private storage: Record<string, SyncPayload> = {};

  async push(featureId: string, payload: SyncPayload): Promise<void> {
    console.log(`[MockCloudProvider] Pushing ${featureId}`, payload);
    const existing = this.storage[featureId];

    if (existing && existing.updatedAt > payload.updatedAt) {
      console.warn(`[MockCloudProvider] Conflict detected for ${featureId}. Remote is newer.`);
      throw new Error("CONFLICT");
    }

    this.storage[featureId] = payload;
    // Persist to localStorage to simulate a real "cloud" that survives refreshes
    localStorage.setItem(`mock-cloud-${featureId}`, JSON.stringify(payload));
  }

  async pull(featureId: string): Promise<SyncPayload | null> {
    console.log(`[MockCloudProvider] Pulling ${featureId}`);
    const local = localStorage.getItem(`mock-cloud-${featureId}`);
    if (local) {
      this.storage[featureId] = JSON.parse(local);
    }
    return this.storage[featureId] || null;
  }

  async listChanges(_since: number): Promise<string[]> {
    // In a real provider, this would return features changed after 'since'
    return Object.keys(this.storage);
  }
}
