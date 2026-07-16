"use client";

import { useSync } from "../hooks/use-sync";
import { Cloud, CloudOff, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function SyncStatusIndicator() {
  const { status, lastSyncedAt, sync } = useSync();

  const getStatusIcon = () => {
    switch (status) {
      case "syncing":
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
      case "synced":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "offline":
        return <CloudOff className="h-4 w-4 text-zinc-500" />;
      case "failed":
      case "conflict":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Cloud className="h-4 w-4 text-zinc-400" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "syncing":
        return "Syncing...";
      case "synced":
        return "Synced";
      case "offline":
        return "Offline";
      case "failed":
        return "Sync Failed";
      case "conflict":
        return "Conflict";
      default:
        return "Not Synced";
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-medium border border-zinc-200 dark:border-zinc-700">
      {getStatusIcon()}
      <span>{getStatusText()}</span>
      {lastSyncedAt && status === "synced" && (
        <span className="text-zinc-500 ml-1">
          {new Date(lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
      <button
        onClick={sync}
        disabled={status === "syncing"}
        className="ml-1 hover:text-blue-500 transition-colors disabled:opacity-50"
        title="Sync Now"
      >
        <RefreshCw className={cn("h-3 w-3", status === "syncing" && "animate-spin")} />
      </button>
    </div>
  );
}
