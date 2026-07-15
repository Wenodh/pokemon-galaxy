"use client";

import { TimelineEvent } from "../types";
import {
  Sparkles,
  Trophy,
  History,
  Briefcase,
  PlusCircle,
  Award,
  Heart,
  Activity,
  Milestone,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressTimelineProps {
  timeline: TimelineEvent[];
}

export function ProgressTimeline({ timeline }: ProgressTimelineProps) {
  const getEventIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "COLLECTION_CREATED":
        return { icon: Briefcase, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" };
      case "POKEMON_CAUGHT":
        return { icon: Sparkles, color: "text-green-500 bg-green-500/10 border-green-500/20" };
      case "POKEMON_SEEN":
        return { icon: Activity, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" };
      case "TEAM_CREATED":
        return { icon: PlusCircle, color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20" };
      case "TEAM_ANALYZED":
        return { icon: Award, color: "text-orange-500 bg-orange-500/10 border-orange-500/20" };
      case "FAVORITE_ADDED":
        return { icon: Heart, color: "text-pink-500 bg-pink-500/10 border-pink-500/20" };
      case "ACHIEVEMENT_UNLOCKED":
        return { icon: Trophy, color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" };
      case "MILESTONE_REACHED":
        return { icon: Milestone, color: "text-teal-500 bg-teal-500/10 border-teal-500/20" };
    }
  };

  if (timeline.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/60 py-16 text-center bg-muted/5">
        <History className="h-10 w-10 text-muted-foreground/30 mb-3" />
        <h3 className="font-bold text-lg mb-1">Timeline Empty</h3>
        <p className="text-sm text-muted-foreground max-w-[240px]">
          Start catching Pokémon, creating custom collections, or building teams to register milestone events.
        </p>
      </div>
    );
  }

  return (
    <div className="relative pl-6 border-l-2 border-border/60 ml-3 space-y-8 py-2">
      {timeline.map((event) => {
        const config = getEventIcon(event.type);
        const Icon = config.icon;

        return (
          <div key={event.id} className="relative group">
            {/* Left bullet badge */}
            <div
              className={cn(
                "absolute -left-[37px] top-1 rounded-xl p-2.5 border flex items-center justify-center shadow-sm transition-transform group-hover:scale-110",
                config.color
              )}
            >
              <Icon className="h-4 w-4 animate-in zoom-in-50 duration-300" />
            </div>

            {/* Event Content Card */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-black text-base tracking-tight leading-snug">
                    {event.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-normal">
                    {event.description}
                  </p>
                </div>
                <div className="text-xs font-semibold text-muted-foreground sm:text-right">
                  {new Date(event.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
