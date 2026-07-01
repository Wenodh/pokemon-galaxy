import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypeCount } from "../types/analysis.types";
import { cn } from "@/lib/utils";

interface DuplicateTypesCardProps {
  duplicates: TypeCount[];
}

export function DuplicateTypesCard({ duplicates }: DuplicateTypesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">Type Diversity</CardTitle>
      </CardHeader>
      <CardContent>
        {duplicates.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">Your team has excellent type diversity.</p>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              These types appear multiple times on your team. This can make you more vulnerable to certain threats.
            </p>
            <div className="flex flex-wrap gap-2">
              {duplicates.map((d) => (
                <div key={d.type} className="flex items-center gap-1.5 p-1.5 pr-3 rounded-full border bg-card shadow-sm">
                   <span className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-full font-bold capitalize text-[10px] border",
                    `type-${d.type}`
                  )}>
                    {d.type.substring(0, 2)}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter leading-none">{d.type}</span>
                    <span className={cn(
                      "text-xs font-black",
                      d.count >= 4 ? "text-red-500" : d.count >= 3 ? "text-orange-500" : "text-foreground"
                    )}>
                      ×{d.count} Pokémon
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
