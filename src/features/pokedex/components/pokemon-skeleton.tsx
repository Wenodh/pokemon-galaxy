import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PokemonGrid } from "./pokemon-grid";

export function PokemonSkeleton() {
  return (
    <Card className="overflow-hidden bg-card/50 border-border/50">
      <div className="aspect-square bg-muted/30 p-4">
        <Skeleton className="h-full w-full rounded-lg" />
      </div>
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-5 w-24" />
        <div className="flex gap-1">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </Card>
  );
}

export function PokemonSkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <PokemonGrid>
      {Array.from({ length: count }).map((_, i) => (
        <PokemonSkeleton key={i} />
      ))}
    </PokemonGrid>
  );
}
