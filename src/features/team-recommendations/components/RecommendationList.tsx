"use client";

import { useState } from "react";
import { Recommendation } from "../types/recommendation.types";
import { RecommendationCard } from "./RecommendationCard";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";

interface RecommendationListProps {
  recommendations: Recommendation[];
}

export function RecommendationList({ recommendations }: RecommendationListProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (recommendations.length === 0) return null;

  const displayCount = 6;
  const hasMore = recommendations.length > displayCount;
  const visibleRecommendations = isExpanded ? recommendations : recommendations.slice(0, displayCount);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 border-b pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-black tracking-tight">Team Recommendations</h2>
        </div>
        <div className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
          {recommendations.length} {recommendations.length === 1 ? 'Tip' : 'Tips'} Detected
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleRecommendations.map((rec) => (
          <div key={rec.id} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <RecommendationCard recommendation={rec} />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="group gap-2 px-8 font-bold border-2"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                View Fewer Recommendations
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                View All {recommendations.length} Recommendations
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
