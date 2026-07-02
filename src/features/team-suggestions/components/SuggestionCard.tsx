import Image from "next/image";
import Link from "next/link";
import { PokemonSuggestion } from "../types/suggestion.types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { CheckCircle2, ChevronRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { PokemonListItem } from "@/features/pokemon/types";

interface SuggestionCardProps {
  suggestion: PokemonSuggestion;
  details: PokemonListItem;
}

export function SuggestionCard({ suggestion, details }: SuggestionCardProps) {
  const confidenceColor = {
    High: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50",
    Medium: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900/50",
    Low: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
  }[suggestion.confidence];

  return (
    <Card className="overflow-hidden group hover:shadow-md transition-all border-l-4 border-l-primary/50">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Artwork */}
          <div className="relative h-20 w-20 flex-shrink-0 bg-muted/50 rounded-lg overflow-hidden p-2 group-hover:scale-105 transition-transform">
            <Image
              src={details.image}
              alt={details.name}
              fill
              className="object-contain"
              sizes="80px"
            />
          </div>

          {/* Info */}
          <div className="flex-grow min-w-0 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-lg capitalize truncate leading-tight">
                    {details.name}
                  </h3>
                  <div className="flex gap-1 mt-1">
                    {details.types.map((type) => (
                      <Badge
                        key={type}
                        variant="secondary"
                        className="text-[10px] uppercase px-1.5 py-0 h-4"
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className={cn("text-[10px] font-bold px-1.5 py-0 h-4", confidenceColor)}>
                    {suggestion.confidence} Match
                  </Badge>
                  <Tooltip content={<p className="text-xs">Ranking score based on team synergy and coverage.</p>}>
                    <div className="text-[10px] font-bold text-muted-foreground flex items-center gap-0.5 cursor-help">
                      Score: {suggestion.score}
                      <Info className="h-2.5 w-2.5" />
                    </div>
                  </Tooltip>
                </div>
              </div>

              {/* Reasons */}
              <div className="mt-2 space-y-1">
                {suggestion.reasons.slice(0, 2).map((reason, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-xs text-foreground/80 leading-snug">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="truncate">{reason}</span>
                  </div>
                ))}
                {suggestion.reasons.length > 2 && (
                  <p className="text-[10px] text-muted-foreground pl-4">
                    +{suggestion.reasons.length - 2} more reasons
                  </p>
                )}
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <Button asChild variant="ghost" size="sm" className="h-7 text-xs font-bold gap-1 group-hover:bg-primary group-hover:text-primary-foreground">
                <Link href={`/pokedex/${details.id}`}>
                  View Details
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
