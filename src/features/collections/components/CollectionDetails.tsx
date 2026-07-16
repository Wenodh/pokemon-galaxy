"use client";

import * as React from "react";
import { useCollectionsStore } from "../store/collections.store";
import { useCollectionPokemon } from "@/features/collection/hooks/use-collection-pokemon";
import { calculateCollectionStats } from "../utils/statistics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/common/empty-state";
import { PokemonGrid } from "@/features/pokedex/components/pokemon-grid";
import { PokemonCard } from "@/features/pokedex/components/pokemon-card";
import { PokemonSkeletonGrid } from "@/features/pokedex/components/pokemon-skeleton";
import { toast } from "sonner";
import {
  ArrowLeft,
  Edit2,
  Check,
  FolderHeart,
  Search,
  ArrowUpDown,
  Trash2,
  CheckSquare,
  Square,
  MoveHorizontal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface CollectionDetailsProps {
  id: string;
}

export function CollectionDetails({ id }: CollectionDetailsProps) {
  const router = useRouter();
  const collections = useCollectionsStore((state) => state.collections);
  const collectionOrder = useCollectionsStore((state) => state.collectionOrder);
  const renameCollection = useCollectionsStore((state) => state.renameCollection);
  const updateDescription = useCollectionsStore((state) => state.updateDescription);
  const deleteCollection = useCollectionsStore((state) => state.deleteCollection);
  const reorderPokemon = useCollectionsStore((state) => state.reorderPokemonInCollection);
  const bulkRemove = useCollectionsStore((state) => state.bulkRemovePokemonFromCollection);
  const bulkAdd = useCollectionsStore((state) => state.bulkAddPokemonToCollection);
  const moveBetween = useCollectionsStore((state) => state.movePokemonBetweenCollections);

  const col = collections[id];

  const [isEditingMetadata, setIsEditingMetadata] = React.useState(false);
  const [editedName, setEditedName] = React.useState("");
  const [editedDesc, setEditedDesc] = React.useState("");

  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"manual" | "name" | "bst" | "id">("manual");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  // Edit Mode state
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [selectedPokemonIds, setSelectedPokemonIds] = React.useState<number[]>([]);

  // Bulk operation target selection dialog
  const [isBulkTargetOpen, setIsBulkTargetOpen] = React.useState(false);
  const [bulkActionType, setBulkActionType] = React.useState<"add" | "move">("add");
  const [targetCollectionId, setTargetCollectionId] = React.useState("");

  const { data: pokemonDetails, isLoading } = useCollectionPokemon(col?.pokemonIds || []);

  React.useEffect(() => {
    if (col) {
      setEditedName(col.name);
      setEditedDesc(col.description);
    }
  }, [col]);

  // Turn off Edit Mode if collection is empty
  React.useEffect(() => {
    if (!col || col.pokemonIds.length === 0) {
      setIsEditMode(false);
      setSelectedPokemonIds([]);
    }
  }, [col]);

  if (!col) {
    return (
      <div className="py-20">
        <EmptyState
          title="Collection not found"
          description="The collection you are looking for does not exist or has been deleted."
          icon={<FolderHeart className="h-12 w-12 text-muted-foreground/30" />}
        >
          <Link href="/collections" passHref legacyBehavior>
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Collections
            </Button>
          </Link>
        </EmptyState>
      </div>
    );
  }

  // Preserve user's custom ordering from col.pokemonIds mapping
  const orderedDetailsList = React.useMemo(() => {
    if (!pokemonDetails) return [];
    return col.pokemonIds
      .map((pid) => pokemonDetails.find((p) => p.id === pid))
      .filter(Boolean) as any[];
  }, [col.pokemonIds, pokemonDetails]);

  // Apply client-side search, sort, filters
  const filteredAndSortedDetails = React.useMemo(() => {
    let list = [...orderedDetailsList];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toString() === q ||
          p.types.some((t: string) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "id") {
      list.sort((a, b) => a.id - b.id);
    } else if (sortBy === "bst") {
      const getBST = (p: any) =>
        Array.isArray(p.stats) ? p.stats.reduce((sum: number, s: any) => sum + (s.value || 0), 0) : 0;
      list.sort((a, b) => getBST(a) - getBST(b));
    }

    if (sortBy !== "manual" && sortDirection === "desc") {
      list.reverse();
    }

    return list;
  }, [orderedDetailsList, searchQuery, sortBy, sortDirection]);

  // Calculate stats on currently listed Pokémon
  const stats = calculateCollectionStats(orderedDetailsList);

  const handleSaveMetadata = () => {
    const name = editedName.trim();
    if (!name) return;

    const nameResult = renameCollection(col.id, name);
    if (!nameResult.ok) {
      toast.error(`Update failed: ${nameResult.error}`);
      return;
    }

    const descResult = updateDescription(col.id, editedDesc.trim());
    if (!descResult.ok) {
      toast.error(`Update failed: ${descResult.error}`);
      return;
    }

    toast.success("Collection updated successfully.");
    setIsEditingMetadata(false);
  };

  const handleMetadataCancel = () => {
    setEditedName(col.name);
    setEditedDesc(col.description);
    setIsEditingMetadata(false);
  };

  const handleMovePokemon = (pokemonId: number, direction: "left" | "right") => {
    const idx = col.pokemonIds.indexOf(pokemonId);
    if (idx === -1) return;

    if (direction === "left" && idx > 0) {
      reorderPokemon(col.id, idx, idx - 1);
    } else if (direction === "right" && idx < col.pokemonIds.length - 1) {
      reorderPokemon(col.id, idx, idx + 1);
    }
  };

  const handleSelectToggle = (pokemonId: number) => {
    setSelectedPokemonIds((prev) =>
      prev.includes(pokemonId) ? prev.filter((id) => id !== pokemonId) : [...prev, pokemonId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPokemonIds.length === filteredAndSortedDetails.length) {
      setSelectedPokemonIds([]);
    } else {
      setSelectedPokemonIds(filteredAndSortedDetails.map((p) => p.id));
    }
  };

  const handleBulkRemove = () => {
    if (selectedPokemonIds.length === 0) return;

    if (
      confirm(
        `Are you sure you want to remove these ${selectedPokemonIds.length} Pokémon from this collection?`
      )
    ) {
      bulkRemove(col.id, selectedPokemonIds);
      toast.success(`Removed ${selectedPokemonIds.length} Pokémon from "${col.name}".`);
      setSelectedPokemonIds([]);
    }
  };

  const handleTriggerBulkAction = (type: "add" | "move") => {
    if (selectedPokemonIds.length === 0) return;
    setBulkActionType(type);

    // Auto pick first other collection as target if any
    const otherCols = collectionOrder.filter((cid) => cid !== col.id);
    if (otherCols.length === 0) {
      toast.error("You must have other collections created to perform this bulk action.");
      return;
    }
    setTargetCollectionId(otherCols[0]);
    setIsBulkTargetOpen(true);
  };

  const handleConfirmBulkAction = () => {
    if (!targetCollectionId || selectedPokemonIds.length === 0) return;
    const targetColName = collections[targetCollectionId]?.name || "Target Collection";

    if (bulkActionType === "add") {
      const result = bulkAdd(targetCollectionId, selectedPokemonIds);
      if (result.ok) {
        toast.success(`Added ${selectedPokemonIds.length} Pokémon to "${targetColName}".`);
      } else {
        toast.error("Failed to execute bulk add.");
      }
    } else {
      // move action
      const result = moveBetween(col.id, targetCollectionId, selectedPokemonIds);
      if (result.ok) {
        toast.success(`Moved ${selectedPokemonIds.length} Pokémon to "${targetColName}".`);
      } else {
        toast.error("Failed to execute bulk move.");
      }
    }

    setIsBulkTargetOpen(false);
    setSelectedPokemonIds([]);
    setIsEditMode(false);
  };

  return (
    <div className="space-y-8">
      {/* Upper Back button & collection header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <Link href="/collections" passHref legacyBehavior>
          <Button variant="ghost" size="sm" className="w-fit">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Collections
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10 h-8 text-xs font-bold"
            onClick={() => {
              if (confirm(`Are you sure you want to delete the collection "${col.name}"?`)) {
                deleteCollection(col.id);
                toast.success(`Deleted "${col.name}".`);
                router.push("/collections");
              }
            }}
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Delete Collection
          </Button>
        </div>
      </div>

      {/* Metadata Card: Name, Description Editing */}
      <Card className="bg-card/40 border-border/50 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          {!isEditingMetadata ? (
            <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => setIsEditingMetadata(true)}>
              <Edit2 className="h-3 w-3" />
              Edit details
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8" onClick={handleMetadataCancel}>
                Cancel
              </Button>
              <Button size="sm" className="h-8 gap-1" onClick={handleSaveMetadata} disabled={!editedName.trim()}>
                <Check className="h-3 w-3" />
                Save
              </Button>
            </div>
          )}
        </div>

        <CardContent className="p-6 md:p-8 space-y-4">
          {!isEditingMetadata ? (
            <div className="space-y-2 max-w-[80%]">
              <h1 className="text-3xl font-black tracking-tight capitalize flex items-center gap-2.5">
                <FolderHeart className="h-8 w-8 text-primary" />
                {col.name}
              </h1>
              <p className="text-muted-foreground text-sm font-medium whitespace-pre-wrap">
                {col.description || "No description provided."}
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-w-xl">
              <div className="space-y-1.5">
                <Label htmlFor="edit-name" className="text-xs font-bold uppercase text-muted-foreground">
                  Collection Name
                </Label>
                <Input
                  id="edit-name"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  maxLength={40}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-desc" className="text-xs font-bold uppercase text-muted-foreground">
                  Description
                </Label>
                <Textarea
                  id="edit-desc"
                  value={editedDesc}
                  onChange={(e) => setEditedDesc(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Accordion/Collapsible */}
      {orderedDetailsList.length > 0 && (
        <div className="space-y-3 bg-muted/10 p-4 md:p-6 rounded-xl border">
          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">
            Collection Statistics
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-card/60 rounded-xl border border-border/40 text-center">
              <div className="text-2xl font-black text-foreground">{stats.totalCount}</div>
              <div className="text-[10px] uppercase font-bold text-muted-foreground">Total Pokémon</div>
            </div>
            <div className="p-3 bg-card/60 rounded-xl border border-border/40 text-center">
              <div className="text-2xl font-black text-foreground">{stats.averageBST}</div>
              <div className="text-[10px] uppercase font-bold text-muted-foreground">Average BST</div>
            </div>
            <div className="p-3 bg-card/60 rounded-xl border border-border/40 text-center">
              <div className="text-2xl font-black text-foreground">{stats.legendaryCount}</div>
              <div className="text-[10px] uppercase font-bold text-muted-foreground">Legendaries</div>
            </div>
            <div className="p-3 bg-card/60 rounded-xl border border-border/40 text-center">
              <div className="text-2xl font-black text-foreground">{stats.mythicalCount}</div>
              <div className="text-[10px] uppercase font-bold text-muted-foreground">Mythicals</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-card/40 rounded-xl border border-border/40 space-y-2">
              <h5 className="text-[11px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" />
                Type Composition
              </h5>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {Object.entries(stats.typeDistribution).map(([type, count]) => (
                  <span
                    key={type}
                    className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-primary/10 text-primary border border-primary/10 capitalize"
                  >
                    {type}: {count}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-card/40 rounded-xl border border-border/40 space-y-2">
              <h5 className="text-[11px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                <BookOpen className="h-3 w-3 text-primary" />
                Generations Breakdown
              </h5>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {Object.entries(stats.generationDistribution).map(([gen, count]) => (
                  <span
                    key={gen}
                    className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-muted text-muted-foreground border border-border"
                  >
                    {gen}: {count}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar / Actions panel */}
      {col.pokemonIds.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-muted/20 p-4 rounded-xl border border-border/50">
            <div className="flex flex-wrap gap-3 items-center flex-1">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search in this collection..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="sort-pokemon" className="text-xs font-bold text-muted-foreground whitespace-nowrap">
                  Sort By:
                </Label>
                <select
                  id="sort-pokemon"
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="h-9 text-xs rounded-lg border border-border bg-background px-3 font-medium focus:outline-none"
                >
                  <option value="manual">Manual / Custom Order</option>
                  <option value="name">Name</option>
                  <option value="id">National ID</option>
                  <option value="bst">Base Stat Total</option>
                </select>

                {sortBy !== "manual" && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setSortDirection((d) => (d === "asc" ? "desc" : "asc"))}
                    aria-label="Toggle sort direction"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={isEditMode ? "secondary" : "outline"}
                size="sm"
                className="h-9 font-bold text-xs gap-1.5"
                onClick={() => {
                  setIsEditMode(!isEditMode);
                  setSelectedPokemonIds([]);
                }}
              >
                <MoveHorizontal className="h-3.5 w-3.5" />
                {isEditMode ? "Exit Edit Mode" : "Edit / Reorder Mode"}
              </Button>
            </div>
          </div>

          {/* Bulk Actions Panel */}
          {isEditMode && (
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={handleSelectAll}
                >
                  {selectedPokemonIds.length === filteredAndSortedDetails.length ? (
                    <CheckSquare className="h-4 w-4 text-primary mr-2" />
                  ) : (
                    <Square className="h-4 w-4 mr-2 text-muted-foreground" />
                  )}
                  <span className="text-xs font-bold">
                    Select All ({filteredAndSortedDetails.length})
                  </span>
                </Button>

                <div className="h-4 w-px bg-border" />

                <span className="text-xs font-bold text-muted-foreground">
                  {selectedPokemonIds.length} Pokémon selected
                </span>
              </div>

              {selectedPokemonIds.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-bold"
                    onClick={() => handleTriggerBulkAction("add")}
                  >
                    Add to Another
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-bold"
                    onClick={() => handleTriggerBulkAction("move")}
                  >
                    Move to Another
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8 text-xs font-bold gap-1"
                    onClick={handleBulkRemove}
                  >
                    <Trash2 className="h-3 w-3" />
                    Remove Selected
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Grid display of Pokémon */}
      {isLoading ? (
        <PokemonSkeletonGrid count={col.pokemonIds.length || 6} />
      ) : col.pokemonIds.length === 0 ? (
        <div className="py-12">
          <EmptyState
            title="Collection is empty"
            description="Explore the Pokédex page or search for your favorite Pokémon, then click the options menu on any card to add them here!"
            icon={<FolderHeart className="h-12 w-12 text-muted-foreground/30" />}
          >
            <Link href="/pokedex" passHref legacyBehavior>
              <Button>Explore Pokédex</Button>
            </Link>
          </EmptyState>
        </div>
      ) : filteredAndSortedDetails.length === 0 ? (
        <div className="py-12">
          <EmptyState
            title="No matching Pokémon"
            description={`No Pokémon in this collection match "${searchQuery}".`}
            icon={<Search className="h-12 w-12 text-muted-foreground/30" />}
          >
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </EmptyState>
        </div>
      ) : (
        <div className="space-y-6">
          <PokemonGrid density="comfortable">
            {filteredAndSortedDetails.map((pokemon) => {
              const isSelected = selectedPokemonIds.includes(pokemon.id);
              return (
                <div key={pokemon.id} className="relative group">
                  {/* Reuse official card */}
                  <div className={isEditMode ? "pointer-events-none opacity-90 select-none" : ""}>
                    <PokemonCard pokemon={pokemon} density="comfortable" />
                  </div>

                  {/* Edit Mode Overlay / Checkboxes and Reordering */}
                  {isEditMode && (
                    <div className="absolute inset-0 z-20 bg-background/5 p-4 flex flex-col justify-between rounded-2xl border-2 border-dashed border-primary/20 pointer-events-auto">
                      {/* Selection toggle corner */}
                      <button
                        type="button"
                        onClick={() => handleSelectToggle(pokemon.id)}
                        className={`absolute top-2 left-2 h-7 w-7 rounded-full flex items-center justify-center border shadow transition-all ${
                          isSelected
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-background border-border hover:bg-accent text-muted-foreground"
                        }`}
                      >
                        {isSelected ? <Check className="h-4 w-4" /> : null}
                      </button>

                      {/* Manual Reordering Controls (Only shown if sortBy is Manual) */}
                      {sortBy === "manual" && !searchQuery.trim() && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-background/90 backdrop-blur border p-1 rounded-full shadow-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            disabled={col.pokemonIds.indexOf(pokemon.id) === 0}
                            onClick={() => handleMovePokemon(pokemon.id, "left")}
                            title="Move Left"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            disabled={
                              col.pokemonIds.indexOf(pokemon.id) === col.pokemonIds.length - 1
                            }
                            onClick={() => handleMovePokemon(pokemon.id, "right")}
                            title="Move Right"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </PokemonGrid>
        </div>
      )}

      {/* Target Collection Selection Dialog for Bulk Operations */}
      <Dialog open={isBulkTargetOpen} onOpenChange={setIsBulkTargetOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-black capitalize">
              {bulkActionType === "add" ? "Bulk Add to Collection" : "Bulk Move to Collection"}
            </DialogTitle>
            <DialogDescription>
              Select the destination custom collection for these {selectedPokemonIds.length} Pokémon.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label htmlFor="bulk-target-select" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Destination Collection
              </Label>
              <select
                id="bulk-target-select"
                value={targetCollectionId}
                onChange={(e) => setTargetCollectionId(e.target.value)}
                className="w-full h-10 text-sm rounded-lg border border-border bg-background px-3 font-medium focus:outline-none"
              >
                {collectionOrder
                  .filter((cid) => cid !== col.id)
                  .map((cid) => {
                    const c = collections[cid];
                    return c ? (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.pokemonIds.length} Pokémon)
                      </option>
                    ) : null;
                  })}
              </select>
            </div>

            <DialogFooter className="pt-2 border-t">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsBulkTargetOpen(false)}>
                Cancel
              </Button>
              <Button type="button" size="sm" onClick={handleConfirmBulkAction} disabled={!targetCollectionId}>
                Confirm
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
