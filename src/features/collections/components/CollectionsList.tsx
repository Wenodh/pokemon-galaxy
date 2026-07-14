"use client";

import * as React from "react";
import { useCollectionsStore } from "../store/collections.store";
import { Collection } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/common/empty-state";
import { toast } from "sonner";
import {
  Folder,
  Plus,
  FolderDown,
  FolderUp,
  LayoutGrid,
  List,
  Search,
  ArrowUpDown,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export function CollectionsList() {
  const collections = useCollectionsStore((state) => state.collections);
  const collectionOrder = useCollectionsStore((state) => state.collectionOrder);
  const createCollection = useCollectionsStore((state) => state.createCollection);
  const deleteCollection = useCollectionsStore((state) => state.deleteCollection);
  const reorderCollections = useCollectionsStore((state) => state.reorderCollections);
  const importCollection = useCollectionsStore((state) => state.importCollection);
  const exportCollection = useCollectionsStore((state) => state.exportCollection);

  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"custom" | "name" | "count" | "date">("custom");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [newColName, setNewColName] = React.useState("");
  const [newColDesc, setNewColDesc] = React.useState("");

  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [importJson, setImportJson] = React.useState("");

  const orderedCollections = React.useMemo(() => {
    // 1. Map to collections
    let list = collectionOrder.map((id) => collections[id]).filter(Boolean);

    // 2. Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (col) =>
          col.name.toLowerCase().includes(q) ||
          col.description.toLowerCase().includes(q)
      );
    }

    // 3. Sort
    if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "count") {
      list.sort((a, b) => a.pokemonIds.length - b.pokemonIds.length);
    } else if (sortBy === "date") {
      list.sort((a, b) => a.createdAt - b.createdAt);
    }

    if (sortBy !== "custom" && sortDirection === "desc") {
      list.reverse();
    }

    return list;
  }, [collections, collectionOrder, searchQuery, sortBy, sortDirection]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newColName.trim();
    if (!name) return;

    const result = createCollection(name, newColDesc.trim());
    if (result.ok) {
      toast.success(`Collection "${name}" created successfully.`);
      setIsCreateOpen(false);
      setNewColName("");
      setNewColDesc("");
    } else {
      toast.error(`Failed to create collection: ${result.error}`);
    }
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJson.trim()) return;

    const result = importCollection(importJson.trim());
    if (result.ok) {
      toast.success("Collection imported successfully!");
      setIsImportOpen(false);
      setImportJson("");
    } else {
      toast.error(`Import failed: ${result.error}`);
    }
  };

  const handleExport = (id: string, name: string) => {
    const result = exportCollection(id);
    if (result.ok && result.value) {
      navigator.clipboard.writeText(result.value);
      toast.success(`Copied "${name}" JSON config to clipboard!`);
    } else {
      toast.error("Failed to export collection.");
    }
  };

  const handleDownloadExport = (id: string, name: string) => {
    const result = exportCollection(id);
    if (result.ok && result.value) {
      const blob = new Blob([result.value], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name.toLowerCase().replace(/\s+/g, "-")}-collection.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded "${name}" JSON file.`);
    } else {
      toast.error("Failed to export collection.");
    }
  };

  const moveUp = (id: string) => {
    const idx = collectionOrder.indexOf(id);
    if (idx > 0) {
      reorderCollections(idx, idx - 1);
    }
  };

  const moveDown = (id: string) => {
    const idx = collectionOrder.indexOf(id);
    if (idx !== -1 && idx < collectionOrder.length - 1) {
      reorderCollections(idx, idx + 1);
    }
  };

  const getCoverUrl = (col: Collection) => {
    const coverId = col.coverPokemonId || col.pokemonIds[0];
    if (coverId) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${coverId}.png`;
    }
    return null;
  };

  const totalUniquePokemon = React.useMemo(() => {
    const allIds = new Set<number>();
    Object.values(collections).forEach((col) => {
      col.pokemonIds.forEach((id) => allIds.add(id));
    });
    return allIds.size;
  }, [collections]);

  return (
    <div className="space-y-6">
      {/* Statistics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card/40 backdrop-blur-sm border-border/50">
          <CardContent className="p-4 flex flex-col justify-center min-h-[90px]">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Total Collections
            </span>
            <span className="text-3xl font-black text-foreground mt-1">
              {Object.keys(collections).length}
            </span>
          </CardContent>
        </Card>
        <Card className="bg-card/40 backdrop-blur-sm border-border/50">
          <CardContent className="p-4 flex flex-col justify-center min-h-[90px]">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Unique Saved Pokémon
            </span>
            <span className="text-3xl font-black text-foreground mt-1">
              {totalUniquePokemon}
            </span>
          </CardContent>
        </Card>
        <Card className="bg-card/40 backdrop-blur-sm border-border/50">
          <CardContent className="p-4 flex flex-col justify-center min-h-[90px]">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Average Size
            </span>
            <span className="text-3xl font-black text-foreground mt-1">
              {Object.keys(collections).length > 0
                ? Math.round(
                    Object.values(collections).reduce((acc, c) => acc + c.pokemonIds.length, 0) /
                      Object.keys(collections).length
                  )
                : 0}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-muted/20 p-4 rounded-xl border border-border/50">
        <div className="flex flex-wrap gap-3 items-center flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="sort-by" className="text-xs font-bold text-muted-foreground whitespace-nowrap">
              Sort By:
            </Label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="h-10 text-sm rounded-lg border border-border bg-background px-3 py-1 font-medium focus:outline-none"
            >
              <option value="custom">Custom Order</option>
              <option value="name">Name</option>
              <option value="count">Pokémon Count</option>
              <option value="date">Date Created</option>
            </select>

            {sortBy !== "custom" && (
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={() => setSortDirection((d) => (d === "asc" ? "desc" : "asc"))}
                aria-label="Toggle sort direction"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          {/* List/Grid View toggles */}
          <div className="flex items-center gap-1 rounded-md border p-1 bg-card">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
              title="List View"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="outline" className="h-10 text-xs" onClick={() => setIsImportOpen(true)}>
            <FolderUp className="mr-1 h-3.5 w-3.5" />
            Import
          </Button>
          <Button className="h-10 text-xs" onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-1 h-3.5 w-3.5" />
            Create Collection
          </Button>
        </div>
      </div>

      {/* Main Collections Layout */}
      {orderedCollections.length === 0 ? (
        <div className="py-12">
          <EmptyState
            title={searchQuery ? "No search results" : "No collections found"}
            description={
              searchQuery
                ? `No custom collections match your search for "${searchQuery}".`
                : "Create a first-class custom collection to organize your favorite Pokémon!"
            }
            icon={<Folder className="h-12 w-12 text-muted-foreground/30" />}
          >
            {searchQuery ? (
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            ) : (
              <Button onClick={() => setIsCreateOpen(true)}>Create Custom Collection</Button>
            )}
          </EmptyState>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orderedCollections.map((col, index) => {
            const coverUrl = getCoverUrl(col);
            return (
              <Card
                key={col.id}
                className="group relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-sm hover:border-primary/40 hover:bg-card transition-all duration-300 flex flex-col justify-between"
              >
                <div className="p-5 space-y-4">
                  {/* Top Header details */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 max-w-[70%]">
                      <h3 className="text-lg font-black tracking-tight capitalize group-hover:text-primary transition-colors line-clamp-1">
                        {col.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">
                        {col.description || "No description provided."}
                      </p>
                    </div>

                    {/* Quick Move controls for reordering */}
                    {sortBy === "custom" && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full"
                          disabled={index === 0}
                          onClick={() => moveUp(col.id)}
                          title="Move up"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full"
                          disabled={index === orderedCollections.length - 1}
                          onClick={() => moveDown(col.id)}
                          title="Move down"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Body Cover Image or Placeholder */}
                  <div className="relative h-32 w-full rounded-xl overflow-hidden bg-muted/40 border border-border/20 flex items-center justify-center p-4">
                    {coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={coverUrl}
                        alt=""
                        className="h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-muted-foreground/40">
                        <Folder className="h-8 w-8" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Empty</span>
                      </div>
                    )}
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-background/80 text-[10px] font-mono font-bold border border-border/50">
                      {col.pokemonIds.length} Pokémon
                    </span>
                  </div>
                </div>

                {/* Card footer links and operations */}
                <div className="border-t border-border/40 p-4 bg-muted/10 flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => handleExport(col.id, col.name)}
                      title="Copy JSON config"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => handleDownloadExport(col.id, col.name)}
                      title="Download JSON file"
                    >
                      <FolderDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${col.name}"?`)) {
                          deleteCollection(col.id);
                          toast.success(`Deleted "${col.name}"`);
                        }
                      }}
                      title="Delete Collection"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <Link href={`/collections/${col.id}`} passHref legacyBehavior>
                    <Button size="sm" className="h-8 text-xs font-bold gap-1">
                      View
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* List View Mode */
        <div className="border rounded-xl divide-y overflow-hidden bg-card/40 backdrop-blur-sm">
          {orderedCollections.map((col, index) => (
            <div
              key={col.id}
              className="p-4 flex items-center justify-between hover:bg-accent/30 transition-all gap-4"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="h-12 w-12 rounded bg-muted/50 border flex items-center justify-center flex-shrink-0">
                  {col.pokemonIds.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                        col.coverPokemonId || col.pokemonIds[0]
                      }.png`}
                      alt=""
                      className="h-10 w-10 object-contain drop-shadow-sm"
                    />
                  ) : (
                    <Folder className="h-5 w-5 text-muted-foreground/30" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-black truncate capitalize">{col.name}</h4>
                  <p className="text-xs text-muted-foreground truncate max-w-lg">
                    {col.description || "No description provided."}
                  </p>
                </div>

                <span className="text-xs font-bold text-muted-foreground px-2.5 py-1 rounded bg-muted">
                  {col.pokemonIds.length} Pokémon
                </span>
              </div>

              <div className="flex items-center gap-3">
                {sortBy === "custom" && (
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={index === 0}
                      onClick={() => moveUp(col.id)}
                      title="Move Up"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={index === orderedCollections.length - 1}
                      onClick={() => moveDown(col.id)}
                      title="Move Down"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div className="flex items-center gap-1 border-l pl-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => handleExport(col.id, col.name)}
                    title="Copy JSON"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${col.name}"?`)) {
                        deleteCollection(col.id);
                        toast.success(`Deleted "${col.name}"`);
                      }
                    }}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Link href={`/collections/${col.id}`} passHref legacyBehavior>
                    <Button size="sm" variant="ghost" className="h-8 text-xs gap-1 font-bold">
                      View
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-black">Create Custom Collection</DialogTitle>
            <DialogDescription>
              Create a permanent custom list to organize your Pokémon team members or favorites.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label htmlFor="col-name" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Collection Name
              </Label>
              <Input
                id="col-name"
                placeholder="e.g. Kanto Gym Leaders, Competitive Sweepers..."
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                maxLength={40}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="col-desc" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Description (Optional)
              </Label>
              <Textarea
                id="col-desc"
                placeholder="What is the purpose of this collection?"
                value={newColDesc}
                onChange={(e) => setNewColDesc(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <DialogFooter className="pt-2 border-t">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={!newColName.trim()}>
                Create Collection
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-black flex items-center gap-2">
              <FolderUp className="h-5 w-5 text-primary" />
              Import Collection
            </DialogTitle>
            <DialogDescription>
              Paste a collection JSON configuration string below to import it as a new custom collection.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleImport} className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label htmlFor="import-textarea" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Collection JSON
              </Label>
              <Textarea
                id="import-textarea"
                placeholder='Paste exported JSON here starting with { "version": 1, ... }'
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                rows={10}
                className="font-mono text-xs resize-none bg-muted/20"
                required
              />
            </div>

            <DialogFooter className="pt-2 border-t">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsImportOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={!importJson.trim()}>
                Import
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
