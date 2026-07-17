"use client";

import { useEffect } from "react";
import { SyncEngine } from "../application/sync-engine";
import { useSyncStore } from "../store/sync.store";
import { useSyncQueueStore } from "../store/sync-queue.store";

export function SyncQueueProcessor() {
  const isEnabled = useSyncStore((state) => state.isEnabled);
  const operationsCount = useSyncQueueStore((state) => state.operations.length);

  useEffect(() => {
    if (isEnabled && operationsCount > 0) {
      SyncEngine.getInstance().processQueue();
    }
  }, [isEnabled, operationsCount]);

  return null;
}
