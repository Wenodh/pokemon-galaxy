import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OffensiveCoverage, DefensiveRating } from "../types/analysis.types";
import { Badge } from "@/components/ui/badge";
import { Check, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";

interface CoverageCardProps {
  offensive: OffensiveCoverage[];
  weaknesses: DefensiveRating[];
  resistances: DefensiveRating[];
  immunities: DefensiveRating[];
}

const ALL_TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground",
  "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
];

export function CoverageCard({ offensive, weaknesses, resistances, immunities }: CoverageCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">Type Coverage Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {ALL_TYPES.map((type) => {
            const off = offensive.find(o => o.type === type);
            const weak = weaknesses.find(w => w.type === type);
            const res = resistances.find(r => r.type === type);
            const imm = immunities.find(i => i.type === type);

            let status: "covered" | "weak" | "missing" | "neutral" = "neutral";
            let label = "Neutral";
            let icon = null;
            let bgColor = "bg-muted/50";

            if (imm) {
              status = "covered";
              label = "Immune";
              icon = <Check className="h-3 w-3" />;
              bgColor = "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
            } else if (res && (!weak || res.count > weak.count)) {
              status = "covered";
              label = "Resistant";
              icon = <Check className="h-3 w-3" />;
              bgColor = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            } else if (weak && (!res || weak.count > res.count)) {
              status = "weak";
              label = "Weak";
              icon = <AlertTriangle className="h-3 w-3" />;
              bgColor = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
            }

            const isOffensiveCovered = off && off.effectiveness > 0;

            return (
              <div key={type} className="flex items-center justify-between p-2 rounded-lg border bg-card text-sm">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "w-20 font-bold capitalize text-xs px-2 py-0.5 rounded border",
                    `type-${type}`
                  )}>
                    {type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                   <Tooltip content={isOffensiveCovered ? `Covered by: ${off.coveredBy.join(", ")}` : "No super-effective coverage"}>
                    <Badge variant={isOffensiveCovered ? "default" : "outline"} className="h-6 w-6 p-0 flex items-center justify-center rounded-full">
                      {isOffensiveCovered ? <Check className="h-3 w-3" /> : <X className="h-3 w-3 text-muted-foreground/50" />}
                    </Badge>
                  </Tooltip>

                  <Tooltip content={label}>
                    <Badge className={cn("h-6 px-2 text-[10px] font-bold uppercase", bgColor)}>
                      {icon && <span className="mr-1">{icon}</span>}
                      {status === "neutral" ? "—" : label}
                    </Badge>
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex gap-4 text-[10px] font-bold uppercase text-muted-foreground">
          <div className="flex items-center gap-1"><Badge className="h-3 w-3 p-0 rounded-full" /> Offensive</div>
          <div className="flex items-center gap-1"><Badge variant="outline" className="h-3 w-3 p-0 rounded-full" /> Defensive</div>
        </div>
      </CardContent>
    </Card>
  );
}
