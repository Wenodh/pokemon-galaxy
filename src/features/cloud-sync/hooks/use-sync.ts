import { useEffect, useRef } from "react";
import { SyncEngine } from "../application/sync-engine";
import { useSyncStore } from "../store/sync.store";

export function useSync() {
  const isEnabled = useSyncStore((state) => state.isEnabled);
  const engine = useRef(SyncEngine.getInstance());

  useEffect(() => {
    if (isEnabled) {
      engine.current.triggerSync();
    }
  }, [isEnabled]);

  // We could add window focus/online listeners here
  useEffect(() => {
    const handleOnline = () => {
      if (isEnabled) {
        engine.current.processQueue();
      }
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [isEnabled]);

  return {
    sync: () => engine.current.triggerSync(),
    status: useSyncStore((state) => state.status),
    lastSyncedAt: useSyncStore((state) => state.lastSyncedAt),
  };
}
