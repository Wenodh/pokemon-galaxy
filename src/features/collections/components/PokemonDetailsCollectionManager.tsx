"use client";

import * as React from "react";
import { useCollectionsStore } from "../store/collections.store";
import { AddToCollectionDialog } from "./AddToCollectionDialog";
import { Button } from "@/components/ui/button";
import { FolderPlus, Tag, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PokemonDetailsCollectionManagerProps {
  pokemonId: number;
  pokemonName: string;
}

export function PokemonDetailsCollectionManager({
  pokemonId,
  pokemonName,
}: PokemonDetailsCollectionManagerProps) {
  const collections = useCollectionsStore((state) => state.collections);
  const collectionOrder = useCollectionsStore((state) => state.collectionOrder);
  const [isOpen, setIsOpen] = React.useState(false);

  // Find collections containing this Pokémon
  const memberCollections = React.useMemo(() => {
    return collectionOrder
      .map((id) => collections[id])
      .filter((col) => col && col.pokemonIds.includes(pokemonId));
  }, [collections, collectionOrder, pokemonId]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <FolderPlus className="h-5 w-5 text-primary" />
          Custom Collections
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="h-8 gap-1"
        >
          <Plus className="h-3.5 w-3.5" />
          Manage Collections
        </Button>
      </div>

      {memberCollections.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">
          This Pokémon does not belong to any custom collections yet.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {memberCollections.map((col) => (
            <Badge
              key={col.id}
              variant="secondary"
              className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-colors gap-1.5"
            >
              <Tag className="h-3 w-3" />
              {col.name}
            </Badge>
          ))}
        </div>
      )}

      {isOpen && (
        <AddToCollectionDialog
          pokemonId={pokemonId}
          pokemonName={pokemonName}
          open={isOpen}
          onOpenChange={setIsOpen}
        />
      )}
    </div>
  );
}
