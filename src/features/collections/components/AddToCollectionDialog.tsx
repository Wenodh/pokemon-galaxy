"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCollectionsStore } from "../store/collections.store";
import { useLivingDexStore } from "../store/living-dex.store";
import { toast } from "sonner";
import { Plus, FolderPlus, Eye, CheckCircle2 } from "lucide-react";

interface AddToCollectionDialogProps {
  pokemonId: number;
  pokemonName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddToCollectionDialog({
  pokemonId,
  pokemonName,
  open,
  onOpenChange,
}: AddToCollectionDialogProps) {
  const collections = useCollectionsStore((state) => state.collections);
  const collectionOrder = useCollectionsStore((state) => state.collectionOrder);
  const createCollection = useCollectionsStore((state) => state.createCollection);
  const addPokemon = useCollectionsStore((state) => state.addPokemonToCollection);
  const removePokemon = useCollectionsStore((state) => state.removePokemonFromCollection);

  const livingDexEntries = useLivingDexStore((state) => state.entries);
  const markSeen = useLivingDexStore((state) => state.markSeen);
  const markCaught = useLivingDexStore((state) => state.markCaught);

  const [newCollectionName, setNewCollectionName] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);

  const orderedCollections = React.useMemo(() => {
    return collectionOrder.map((id) => collections[id]).filter(Boolean);
  }, [collections, collectionOrder]);

  const pokemonEntry = livingDexEntries[pokemonId] || { seen: false, caught: false };

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCollectionName.trim();
    if (!name) return;

    setIsCreating(true);
    const result = createCollection(name);
    setIsCreating(false);

    if (result.ok) {
      setNewCollectionName("");
      // Automatically add the Pokémon to this newly created collection
      addPokemon(result.value, pokemonId);
      toast.success(`Created "${name}" and added ${pokemonName}!`);
    } else {
      if (result.error === "DUPLICATE_NAME") {
        toast.error("A collection with this name already exists.");
      } else if (result.error === "EMPTY_NAME") {
        toast.error("Collection name cannot be empty.");
      } else if (result.error === "NAME_TOO_LONG") {
        toast.error("Collection name is too long (max 40 characters).");
      } else {
        toast.error("Failed to create collection.");
      }
    }
  };

  const handleCollectionToggle = (collectionId: string, isChecked: boolean) => {
    const col = collections[collectionId];
    if (!col) return;

    if (isChecked) {
      const result = addPokemon(collectionId, pokemonId);
      if (result.ok) {
        toast.success(`Added ${pokemonName} to "${col.name}".`);
      } else {
        toast.error(`Already exists in "${col.name}".`);
      }
    } else {
      const result = removePokemon(collectionId, pokemonId);
      if (result.ok) {
        toast.success(`Removed ${pokemonName} from "${col.name}".`);
      } else {
        toast.error(`Failed to remove from "${col.name}".`);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px] p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl font-black capitalize flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-primary" />
            Organize {pokemonName}
          </DialogTitle>
          <DialogDescription>
            Add or remove this Pokémon from your custom collections and track its completion in the Living Pokédex.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Section: Living Dex Tracking */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">
              Living Pokédex Tracking
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  markSeen(pokemonId, !pokemonEntry.seen);
                  toast.success(
                    !pokemonEntry.seen
                      ? `Marked ${pokemonName} as Seen.`
                      : `Removed ${pokemonName} from Seen.`
                  );
                }}
                className={`flex items-center gap-2 rounded-xl border p-3 text-left transition-all hover:bg-accent/40 ${
                  pokemonEntry.seen
                    ? "border-blue-500/40 bg-blue-500/5 text-blue-500 dark:bg-blue-500/10"
                    : "border-border bg-card/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye className="h-4 w-4" />
                <div className="text-xs font-bold">Seen</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  markCaught(pokemonId, !pokemonEntry.caught);
                  toast.success(
                    !pokemonEntry.caught
                      ? `Marked ${pokemonName} as Caught/Collected.`
                      : `Removed ${pokemonName} from Caught/Collected.`
                  );
                }}
                className={`flex items-center gap-2 rounded-xl border p-3 text-left transition-all hover:bg-accent/40 ${
                  pokemonEntry.caught
                    ? "border-green-500/40 bg-green-500/5 text-green-500 dark:bg-green-500/10"
                    : "border-border bg-card/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                <div className="text-xs font-bold">Caught</div>
              </button>
            </div>
          </div>

          {/* Section: Custom Collections */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">
              Custom Collections
            </h4>

            {orderedCollections.length === 0 ? (
              <div className="text-xs text-muted-foreground text-center py-4 bg-muted/20 rounded-xl border border-dashed">
                You haven&apos;t created any custom collections yet.
              </div>
            ) : (
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 border rounded-xl p-3 bg-muted/10">
                {orderedCollections.map((col) => {
                  const isInCollection = col.pokemonIds.includes(pokemonId);
                  return (
                    <label
                      key={col.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-all"
                    >
                      <span className="text-sm font-medium truncate pr-4">{col.name}</span>
                      <input
                        type="checkbox"
                        checked={isInCollection}
                        onChange={(e) => handleCollectionToggle(col.id, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
                      />
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section: Create New Collection Quick Form */}
          <form onSubmit={handleCreateCollection} className="space-y-2 pt-2 border-t">
            <Label htmlFor="quick-col-name" className="text-xs font-bold text-muted-foreground">
              Create New Collection
            </Label>
            <div className="flex gap-2">
              <Input
                id="quick-col-name"
                placeholder="e.g. Shinies, Gen 3 Favorites..."
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                maxLength={40}
                className="h-9 text-xs"
              />
              <Button type="submit" disabled={isCreating || !newCollectionName.trim()} className="h-9 px-3 gap-1">
                <Plus className="h-3 w-3" />
                <span className="text-xs">Create</span>
              </Button>
            </div>
          </form>
        </div>

        <DialogFooter className="pt-2 border-t flex sm:justify-end">
          <Button onClick={() => onOpenChange(false)} size="sm">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
