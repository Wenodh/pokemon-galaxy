"use client";

import { DefensiveRating } from "../types/analysis.types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";
import { AlertTriangle, Shield, Zap, Minus } from "lucide-react";

interface WeaknessMatrixProps {
  weaknesses: DefensiveRating[];
  resistances: DefensiveRating[];
  immunities: DefensiveRating[];
}

const ALL_TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground",
  "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
];

export function WeaknessMatrix({ weaknesses, resistances, immunities }: WeaknessMatrixProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">Defensive Vulnerability Matrix</CardTitle>
        <CardDescription>
          Team-wide defensive profile against every attack type.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {ALL_TYPES.map((type) => {
            const weak = weaknesses.find(w => w.type === type);
            const res = resistances.find(r => r.type === type);
            const imm = immunities.find(i => i.type === type);

            let status: "immune" | "resistant" | "weak" | "neutral" = "neutral";
            if (imm) status = "immune";
            else if (res && (!weak || res.count > weak.count)) status = "resistant";
            else if (weak && (!res || weak.count > res.count)) status = "weak";

            const config = {
                immune: {
                    icon: <Zap className="h-3.5 w-3.5" />,
                    color: "bg-blue-500",
                    bg: "bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-900/30",
                    text: "text-blue-700 dark:text-blue-400",
                    label: "Immune"
                },
                resistant: {
                    icon: <Shield className="h-3.5 w-3.5" />,
                    color: "bg-green-500",
                    bg: "bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-900/30",
                    text: "text-green-700 dark:text-green-400",
                    label: "Resistant"
                },
                weak: {
                    icon: <AlertTriangle className="h-3.5 w-3.5" />,
                    color: "bg-red-500",
                    bg: "bg-red-50/50 border-red-200 dark:bg-red-900/10 dark:border-red-900/30",
                    text: "text-red-700 dark:text-red-400",
                    label: "Weak"
                },
                neutral: {
                    icon: <Minus className="h-3.5 w-3.5" />,
                    color: "bg-muted",
                    bg: "bg-muted/10 border-transparent",
                    text: "text-muted-foreground/40",
                    label: "Neutral"
                }
            };

            const active = config[status];

            return (
              <Tooltip key={type} content={`${type.charAt(0).toUpperCase() + type.slice(1)}: ${active.label}`}>
                <div
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-lg border transition-all hover:ring-2 hover:ring-primary/20",
                    active.bg
                  )}
                >
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-tighter mb-1",
                    active.text
                  )}>
                    {type}
                  </span>
                  <div className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center shadow-sm text-white",
                    active.color,
                    status === "neutral" && "text-muted-foreground/30 shadow-none"
                  )}>
                    {active.icon}
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
