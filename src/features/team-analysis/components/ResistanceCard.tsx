import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DefensiveRating } from "../types/analysis.types";
import { Badge } from "@/components/ui/badge";

interface ResistanceCardProps {
  resistances: DefensiveRating[];
  immunities: DefensiveRating[];
}

export function ResistanceCard({ resistances, immunities }: ResistanceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">Resistances & Immunities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Immunities</h4>
          {immunities.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No immunities.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {immunities.map((i) => (
                <Badge key={i.type} className="bg-blue-500 hover:bg-blue-600 px-3 py-1">
                  <span className="capitalize mr-2">{i.type}</span>
                  <span className="opacity-70 font-mono text-[10px]">IMMUNE</span>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Resistances</h4>
          {resistances.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No shared resistances.</p>
          ) : (
            <div className="space-y-2">
              {resistances.slice(0, 8).map((r) => (
                <div key={r.type} className="flex items-center justify-between">
                  <span className="text-sm capitalize font-medium">{r.type}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: r.count }).map((_, i) => (
                      <CheckIcon key={i} className="h-4 w-4 text-green-500" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
