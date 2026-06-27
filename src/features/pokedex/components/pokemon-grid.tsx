import { cn } from "@/lib/utils";

import { CardDensity } from "@/store/user-preferences-store";

interface PokemonGridProps {
  children: React.ReactNode;
  className?: string;
  density?: CardDensity;
}

export function PokemonGrid({ children, className, density = "comfortable" }: PokemonGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4 sm:gap-6",
        density === "comfortable"
          ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
          : "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10",
        className
      )}
    >
      {children}
    </div>
  );
}
