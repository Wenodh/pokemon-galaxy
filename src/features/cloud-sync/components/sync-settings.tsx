"use client";

import { useSyncStore } from "../store/sync.store";
import { useSync } from "../hooks/use-sync";
import { useSession, signOut } from "next-auth/react";
import { Cloud, RefreshCw, LogOut, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SyncSettings() {
  const { data: session, status: authStatus } = useSession();
  const { isEnabled, setEnabled } = useSyncStore();
  const { sync, status: syncStatus, lastSyncedAt } = useSync();

  const handleToggleSync = () => {
    if (!session) {
      toast.error("Sign in required", {
        description: "You must be signed in to enable cloud sync.",
      });
      return;
    }
    setEnabled(!isEnabled);
    toast.success(isEnabled ? "Cloud sync disabled" : "Cloud sync enabled");
  };

  const handleClearLocalData = () => {
    if (confirm("Are you sure? This will clear all local data including favorites and teams.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (authStatus === "loading") {
    return <div className="animate-pulse h-40 bg-zinc-100 dark:bg-zinc-800 rounded-lg"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <User className="h-5 w-5 text-zinc-500" />
                User Account
              </h3>
              <p className="text-sm text-zinc-500">
                {session ? `Signed in as ${session.user?.email}` : "Sign in to backup your data."}
              </p>
            </div>
            {session ? (
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Button asChild size="sm">
                <a href="/auth/signin">Sign In</a>
              </Button>
            )}
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Cloud className="h-5 w-5 text-zinc-500" />
                Cloud Synchronization
              </h3>
              <p className="text-sm text-zinc-500">
                Keep your Pokémon data in sync across all your devices.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleSync}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isEnabled ? "bg-blue-600" : "bg-zinc-200 dark:bg-zinc-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {isEnabled && (
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-md p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Status</span>
                <span className="font-medium capitalize">{syncStatus.replace("_", " ")}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Last Synced</span>
                <span className="font-medium">
                  {lastSyncedAt ? new Date(lastSyncedAt).toLocaleString() : "Never"}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={sync}
                  disabled={syncStatus === "syncing"}
                  className="w-full"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${syncStatus === "syncing" ? "animate-spin" : ""}`} />
                  Sync Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-red-600 flex items-center gap-2 mb-2">
          <Trash2 className="h-5 w-5" />
          Danger Zone
        </h3>
        <p className="text-sm text-zinc-500 mb-4">
          Actions here are permanent and cannot be undone.
        </p>
        <Button variant="destructive" onClick={handleClearLocalData}>
          Clear All Local Data
        </Button>
      </div>
    </div>
  );
}
