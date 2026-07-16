"use client";

import { ACHIEVEMENTS_REGISTRY } from "../constants/achievements";
import { Input } from "@/components/ui/input";
import {
  Trophy,
  Lock,
  Search,
  Filter,
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

interface AchievementsListProps {
  completedMap: Record<string, number>;
  metricsProgress: Record<string, number>;
}

export function AchievementsList({ completedMap, metricsProgress }: AchievementsListProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "COMPLETED" | "LOCKED">("ALL");

  const categories = ["ALL", "LIVING_DEX", "COLLECTIONS", "TEAMS", "ANALYSIS", "EXPLORATION"];

  const filteredAchievements = useMemo(() => {
    return ACHIEVEMENTS_REGISTRY.filter((ach) => {
      // 1. Search Query
      const matchesSearch =
        ach.title.toLowerCase().includes(search.toLowerCase()) ||
        ach.description.toLowerCase().includes(search.toLowerCase());

      // 2. Category
      const matchesCategory = categoryFilter === "ALL" || ach.category === categoryFilter;

      // 3. Status
      const isCompleted = !!completedMap[ach.id];
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "COMPLETED" && isCompleted) ||
        (statusFilter === "LOCKED" && !isCompleted);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, categoryFilter, statusFilter, completedMap]);

  return (
    <div className="space-y-6">
      {/* Filtering Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search achievements..."
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <SelectFilter
            value={statusFilter}
            onChange={(val: any) => setStatusFilter(val)}
            options={[
              { value: "ALL", label: "All Statuses" },
              { value: "COMPLETED", label: "Completed" },
              { value: "LOCKED", label: "Locked" },
            ]}
          />

          <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-muted/30 p-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all",
                  categoryFilter === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {cat.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Achievement Cards */}
      {filteredAchievements.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/60 py-16 text-center bg-muted/5">
          <Trophy className="h-10 w-10 text-muted-foreground/30 mb-3" />
          <h3 className="font-bold text-lg mb-1">No Achievements Found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search query or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filteredAchievements.map((ach) => {
            const isCompleted = !!completedMap[ach.id];
            const currentValue = metricsProgress[ach.metric] || 0;
            const percentage = Math.min(Math.round((currentValue / ach.target) * 100), 100);

            return (
              <div
                key={ach.id}
                className={cn(
                  "relative overflow-hidden rounded-2xl border p-5 flex flex-col justify-between gap-4 transition-all shadow-sm",
                  isCompleted
                    ? "border-green-500/20 bg-green-500/[0.02] hover:shadow-md"
                    : "border-border bg-card hover:border-border-hover"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black tracking-wider uppercase text-muted-foreground">
                        {ach.category.replace("_", " ")}
                      </span>
                      {isCompleted && (
                        <span className="inline-flex h-2 w-2 rounded-full bg-green-500" />
                      )}
                    </div>
                    <h4 className="font-black text-lg tracking-tight leading-snug">
                      {ach.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {ach.description}
                    </p>
                  </div>

                  <div
                    className={cn(
                      "rounded-xl p-2.5 flex items-center justify-center shadow-sm border",
                      isCompleted
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : "bg-muted/50 text-muted-foreground border-border"
                    )}
                  >
                    {isCompleted ? (
                      <Trophy className="h-4 w-4" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </div>
                </div>

                {/* Achievement Progress */}
                <div className="space-y-1.5 pt-1 mt-auto">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-muted-foreground">
                      {isCompleted
                        ? "Completed!"
                        : `${currentValue} / ${ach.target}`}
                    </span>
                    <span className={cn(isCompleted ? "text-green-500" : "text-muted-foreground")}>
                      {percentage}%
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-500",
                        isCompleted ? "bg-green-500" : "bg-primary"
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  {isCompleted && completedMap[ach.id] && (
                    <div className="text-[10px] font-medium text-muted-foreground pt-1 italic">
                      Unlocked on: {new Date(completedMap[ach.id]).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SelectFilter({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-xl border border-border bg-card px-4 py-2 pr-9 text-xs font-bold text-muted-foreground transition-all hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <Filter className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 pointer-events-none text-muted-foreground/60" />
    </div>
  );
}
