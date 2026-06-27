import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/common/container";

export function PokemonHeroSkeleton() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-12 lg:py-20">
      <Container>
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-end lg:gap-16">
          <div className="relative aspect-square w-full max-w-[320px] lg:max-w-[480px]">
            <Skeleton className="h-full w-full rounded-full" />
          </div>
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 mx-auto lg:mx-0" />
              <Skeleton className="h-16 w-64 mx-auto lg:mx-0 sm:h-20 sm:w-80" />
            </div>
            <div className="flex justify-center gap-3 lg:justify-start">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
            <div className="flex justify-center gap-12 lg:justify-start">
              <div className="space-y-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-8 w-20" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export function PokemonStatsSkeleton() {
  return (
    <Card className="h-full border-border/50 bg-card/50 p-6 backdrop-blur-sm md:p-8">
      <div className="mb-6 flex items-baseline justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="space-y-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function PokemonAbilitiesSkeleton() {
  return (
    <Card className="h-full border-border/50 bg-card/50 p-6 backdrop-blur-sm md:p-8">
      <Skeleton className="mb-6 h-8 w-32" />
      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-24" />
              {i === 1 && <Skeleton className="h-5 w-16 rounded-full" />}
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function EvolutionChainSkeleton() {
  return (
    <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm md:p-8">
      <Skeleton className="mb-8 h-8 w-48" />
      <div className="flex flex-col items-center justify-center gap-8 lg:flex-row">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-4 lg:flex-row lg:gap-8">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-24 w-24 rounded-full md:h-32 md:w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
            {i < 2 && <Skeleton className="h-8 w-8 hidden lg:block" />}
            {i < 2 && <Skeleton className="h-8 w-8 block lg:hidden" />}
          </div>
        ))}
      </div>
    </Card>
  );
}

export function PokemonDetailsSkeleton() {
  return (
    <div className="min-h-screen pb-20">
      <PokemonHeroSkeleton />
      <Container>
        <div className="mt-8 flex flex-col gap-8 lg:mt-12">
          <div className="mx-auto max-w-3xl space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 mx-auto" />
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <PokemonStatsSkeleton />
            <PokemonAbilitiesSkeleton />
          </div>
          <EvolutionChainSkeleton />
          <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm md:p-8">
            <Skeleton className="mb-6 h-8 w-48" />
            <div className="grid gap-8 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-4 w-24" />
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <Skeleton key={j} className="h-8 w-16" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
