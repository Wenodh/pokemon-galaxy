"use client";

import { TrainerStatistics } from "../types";
import {
  Sparkles,
  Award,
  PlusCircle,
  Briefcase,
  Heart,
  FileUp,
  Compass,
} from "lucide-react";

interface StatisticsGridProps {
  stats: TrainerStatistics;
}

export function StatisticsGrid({ stats }: StatisticsGridProps) {
  const statItems = [
    {
      label: "Pokémon Caught",
      value: stats.pokemonCaught,
      subtitle: `${stats.livingDexCompletion}% National Completion`,
      icon: Sparkles,
      color: "text-green-500 bg-green-500/10",
    },
    {
      label: "Pokémon Seen",
      value: stats.pokemonSeen,
      subtitle: "Unique species encountered",
      icon: Compass,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      label: "Collections Created",
      value: stats.collectionsCreated,
      subtitle: "Permanent organizational folders",
      icon: Briefcase,
      color: "text-purple-500 bg-purple-500/10",
    },
    {
      label: "Pokémon in Collections",
      value: stats.pokemonInCollections,
      subtitle: "Total items sorted",
      icon: PlusCircle,
      color: "text-indigo-500 bg-indigo-500/10",
    },
    {
      label: "Teams Built",
      value: stats.teamsCreated,
      subtitle: "Custom battle groups",
      icon: Award,
      color: "text-red-500 bg-red-500/10",
    },
    {
      label: "Team Analyses",
      value: stats.teamAnalyses,
      subtitle: "Competitive reports triggered",
      icon: Award,
      color: "text-orange-500 bg-orange-500/10",
    },
    {
      label: "Favorite Pokémon",
      value: stats.favoritesCount,
      subtitle: "Saves in favorites list",
      icon: Heart,
      color: "text-pink-500 bg-pink-500/10",
    },
    {
      label: "Shared & Imported",
      value: stats.importedCollections + stats.exportedCollections,
      subtitle: `${stats.importedCollections} Imports | ${stats.exportedCollections} Exports`,
      icon: FileUp,
      color: "text-teal-500 bg-teal-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {item.label}
              </span>
              <div className={`rounded-xl p-2.5 ${item.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-4 space-y-1">
              <div className="text-2xl font-black tracking-tight">{item.value}</div>
              <p className="text-[11px] text-muted-foreground font-medium leading-normal">
                {item.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
