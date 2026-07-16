"use client";

import * as React from "react";
import { useVirtualizer, VirtualItem } from "@tanstack/react-virtual";
import { PokemonListItem } from "../types";
import { PokemonCard } from "./pokemon-card";
import { CardDensity } from "@/store/user-preferences-store";
import { cn } from "@/lib/utils";

interface VirtualizedPokemonGridProps {
  pokemon: PokemonListItem[];
  density?: CardDensity;
  mode?: "pokedex" | "team-builder";
  onAddToOtherTeam?: (pokemon: PokemonListItem) => void;
  className?: string;
}

export function VirtualizedPokemonGrid({
  pokemon,
  density = "comfortable",
  mode = "pokedex",
  onAddToOtherTeam,
  className,
}: VirtualizedPokemonGridProps) {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const getColumnCount = () => {
    if (typeof window === "undefined") return 6;
    const width = window.innerWidth;
    if (density === "comfortable") {
      if (width >= 1536) return 6;
      if (width >= 1280) return 5;
      if (width >= 1024) return 4;
      if (width >= 768) return 3;
      return 2;
    } else {
      if (width >= 1536) return 10;
      if (width >= 1280) return 8;
      if (width >= 1024) return 6;
      if (width >= 768) return 5;
      if (width >= 640) return 4;
      return 3;
    }
  };

  const [columnCount, setColumnCount] = React.useState(getColumnCount);

  React.useEffect(() => {
    const handleResize = () => setColumnCount(getColumnCount());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [density]);

  const rowCount = Math.ceil(pokemon.length / columnCount);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (density === "comfortable" ? 380 : 220),
    overscan: 5,
  });

  return (
    <div
      ref={parentRef}
      className={cn("h-[800px] overflow-auto pr-2", className)}
      style={{
        contain: "strict",
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow: VirtualItem) => (
          <div
            key={virtualRow.key}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
              display: "grid",
              gap: density === "comfortable" ? "1.5rem" : "1rem",
              gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
              paddingBottom: density === "comfortable" ? "1.5rem" : "1rem",
            }}
          >
            {Array.from({ length: columnCount }).map((_, colIndex) => {
              const itemIndex = virtualRow.index * columnCount + colIndex;
              const item = pokemon[itemIndex];

              if (!item) return <div key={colIndex} />;

              return (
                <div key={item.id}>
                  <PokemonCard
                    pokemon={item}
                    density={density}
                    mode={mode}
                    onAddToOtherTeam={onAddToOtherTeam}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
