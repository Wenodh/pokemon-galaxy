"use client";

import { OffensiveCoverage } from "../types/analysis.types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";

interface CoverageMatrixProps {
  coverage: OffensiveCoverage[];
}

const ALL_TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground",
  "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
];

export function CoverageMatrix({ coverage }: CoverageMatrixProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">Offensive Coverage Matrix</CardTitle>
        <CardDescription>
          Super-effective coverage across all types.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {ALL_TYPES.map((type) => {
            const off = coverage.find(o => o.type === type);
            const isCovered = off && off.effectiveness > 0;

            return (
              <Tooltip
                key={type}
                content={isCovered ? `Covered by: ${off.coveredBy.join(", ")}` : `No ${type} coverage`}
              >
                <div
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-lg border transition-all hover:ring-2 hover:ring-primary/20",
                    isCovered
                      ? "bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-900/30"
                      : "bg-muted/30 border-dashed"
                  )}
                >
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-tighter mb-1",
                    isCovered ? "text-green-700 dark:text-green-400" : "text-muted-foreground"
                  )}>
                    {type}
                  </span>
                  <div className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center shadow-sm",
                    isCovered ? "bg-green-500 text-white" : "bg-muted text-muted-foreground/30"
                  )}>
                    {isCovered ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                  </div>
                </div>
              </Tooltip>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
