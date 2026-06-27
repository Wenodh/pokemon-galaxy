import { cn } from "@/lib/utils";

interface PokemonGridProps {
  children: React.ReactNode;
  className?: string;
}

export function PokemonGrid({ children, className }: PokemonGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
        className
      )}
    >
      {children}
    </div>
  );
}
