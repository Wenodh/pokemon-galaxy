import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DefensiveRating } from "../types/analysis.types";
import { cn } from "@/lib/utils";

interface WeaknessCardProps {
  weaknesses: DefensiveRating[];
}

export function WeaknessCard({ weaknesses }: WeaknessCardProps) {
  const sortedWeaknesses = [...weaknesses].sort((a, b) => b.count - a.count);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">Team Weaknesses</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedWeaknesses.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No shared weaknesses detected.</p>
        ) : (
          <div className="space-y-3">
            {sortedWeaknesses.map((w) => (
              <div key={w.type} className="flex items-center justify-between">
                <span className={cn(
                  "font-bold capitalize text-xs px-2 py-0.5 rounded border min-w-[80px] text-center",
                  `type-${w.type}`
                )}>
                  {w.type}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: w.count }).map((_, i) => (
                      <div key={i} className="h-4 w-1.5 rounded-full bg-red-500" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-red-500">×{w.count}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
