"use client";

import { Recommendation } from "../types/recommendation.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, AlertCircle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const { severity, title, description, suggestedAction, category } = recommendation;

  const severityConfig = {
    high: {
      icon: <AlertCircle className="h-4 w-4" />,
      color: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-900/30",
      badge: "bg-red-500 hover:bg-red-600",
    },
    medium: {
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-900/30",
      badge: "bg-orange-500 hover:bg-orange-600",
    },
    low: {
      icon: <Info className="h-4 w-4" />,
      color: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900/30",
      badge: "bg-blue-500 hover:bg-blue-600",
    },
  }[severity];

  return (
    <Card className={cn("overflow-hidden border-2 transition-all hover:shadow-md", severityConfig.color)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {severityConfig.icon}
            <Badge className={cn("uppercase text-[10px] font-bold tracking-wider", severityConfig.badge)}>
              {severity}
            </Badge>
          </div>
          <span className="text-[10px] font-medium uppercase tracking-widest opacity-70">
            {category}
          </span>
        </div>
        <CardTitle className="mt-2 text-lg font-bold leading-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-sm leading-relaxed text-foreground/80">
          {description}
        </CardDescription>
        <div className="flex items-start gap-3 rounded-lg bg-background/50 p-3 border border-border/50">
          <Lightbulb className="h-4 w-4 shrink-0 text-yellow-500 mt-0.5" />
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Suggested Action</p>
            <p className="text-sm font-medium leading-tight">{suggestedAction}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
