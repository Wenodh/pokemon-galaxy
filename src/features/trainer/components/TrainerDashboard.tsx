"use client";

import { useTrainerStore } from "../store/trainer.store";
import { TrainerStatisticsService } from "../application/statistics-service";
import { TrainerCard } from "./TrainerCard";
import { StatisticsGrid } from "./StatisticsGrid";
import { AchievementsList } from "./AchievementsList";
import { ProgressTimeline } from "./ProgressTimeline";
import { PageLayout } from "@/components/layout/page-layout";
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Trophy, History, LayoutDashboard, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TrainerDashboard() {
  const { profile, timeline, viewedPokemonSet, exportedCount, importedCount, teamAnalysesCount, clearProfile } = useTrainerStore();
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "ACHIEVEMENTS" | "TIMELINE">("OVERVIEW");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const stats = useMemo(() => {
    return TrainerStatisticsService.getStatistics(
      viewedPokemonSet.length,
      exportedCount,
      importedCount,
      teamAnalysesCount
    );
  }, [viewedPokemonSet, exportedCount, importedCount, teamAnalysesCount]);

  if (!isHydrated) return null;

  const tabs = [
    { id: "OVERVIEW" as const, label: "Overview", icon: LayoutDashboard },
    { id: "ACHIEVEMENTS" as const, label: "Achievements", icon: Trophy },
    { id: "TIMELINE" as const, label: "Timeline", icon: History },
  ];

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl space-y-10 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Header summary text */}
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight">Trainer Profile</h1>
          <p className="text-muted-foreground text-sm">
            Track long-term trainer metrics, view accomplishments, and milestones across your Pokémon journey.
          </p>
        </div>

        {/* Main Trainer Card Customizer */}
        <TrainerCard />

        {/* Tab Selection Row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-2">
          <div className="flex gap-2 p-1 rounded-xl bg-muted/40 border border-border w-fit">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all",
                    activeTab === tab.id
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (confirm("Are you sure you want to reset your Trainer Profile statistics? This won't affect collections, favorites, or teams.")) {
                clearProfile();
              }
            }}
            className="text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20"
          >
            Reset Trainer Data
          </Button>
        </div>

        {/* Tab Content Display */}
        {activeTab === "OVERVIEW" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Quick Metrics Dashboard */}
            <StatisticsGrid stats={stats} />

            {/* Completion Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Milestone Tracker Card */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  Living Dex Milestones
                </h3>
                <div className="space-y-4">
                  {[10, 25, 50, 75, 90, 100].map((percent) => {
                    const isUnlocked = profile.completedMilestones.includes(percent);
                    return (
                      <div key={percent} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold border shadow-sm",
                            isUnlocked
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : "bg-muted/50 text-muted-foreground border-border"
                          )}>
                            {isUnlocked ? "✓" : percent}
                          </div>
                          <span className={cn(
                            "text-sm font-semibold",
                            isUnlocked ? "text-foreground" : "text-muted-foreground"
                          )}>
                            {percent}% Pokédex Registered
                          </span>
                        </div>
                        <span className="text-xs font-bold text-muted-foreground">
                          {isUnlocked ? "UNLOCKED" : "LOCKED"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Achievement Quick Peek */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="font-black text-lg flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Latest Unlocked Badge
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your achievements reflect your active exploration of the Pokémon Galaxy.
                  </p>
                </div>

                <div className="mt-6 p-5 rounded-xl border border-dashed border-border/80 bg-muted/5 flex flex-col justify-center items-center text-center py-10">
                  <Trophy className="h-8 w-8 text-primary mb-3" />
                  <p className="font-bold text-sm">Collect \& Explore</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                    Jump over to the achievements tab to filter and browse locked milestones.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ACHIEVEMENTS" && (
          <div className="animate-in fade-in duration-300">
            <AchievementsList
              completedMap={profile.completedAchievements}
              metricsProgress={stats as any}
            />
          </div>
        )}

        {activeTab === "TIMELINE" && (
          <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
            <ProgressTimeline timeline={timeline} />
          </div>
        )}

      </div>
    </PageLayout>
  );
}
