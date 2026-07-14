"use client";

import * as React from "react";
import { useLivingDexStore } from "../store/living-dex.store";
import { GENERATIONS, POKEMON_TYPES } from "../constants";
import { calculateProgressStats } from "../utils/statistics";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePokemonList } from "@/features/pokedex/hooks/use-pokemon-list";
import { PokemonSkeletonGrid } from "@/features/pokedex/components/pokemon-skeleton";
import { InfiniteLoader } from "@/features/pokedex/components/infinite-loader";
import { EmptyState } from "@/components/common/empty-state";
import { toast } from "sonner";
import {
  Search,
  Eye,
  CheckCircle2,
  Filter,
  Award,
  BookOpen,
  Layers,
} from "lucide-react";

export function LivingDexDashboard() {
  const entries = useLivingDexStore((state) => state.entries);
  const markSeen = useLivingDexStore((state) => state.markSeen);
  const markCaught = useLivingDexStore((state) => state.markCaught);
  const clearLivingDex = useLivingDexStore((state) => state.clearLivingDex);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterMode, setFilterMode] = React.useState<"all" | "seen" | "unseen" | "caught" | "uncaught">("all");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = usePokemonList({ search: searchQuery });

  // 1. Calculate General/National Dex Progress
  const nationalDexIds = React.useMemo(() => {
    const ids: number[] = [];
    for (let i = 1; i <= 1025; i++) {
      ids.push(i);
    }
    return ids;
  }, []);

  const nationalProgress = React.useMemo(() => {
    return calculateProgressStats(entries, nationalDexIds);
  }, [entries, nationalDexIds]);

  // 2. Calculate Generation Progress
  const genProgressList = React.useMemo(() => {
    return GENERATIONS.map((gen) => {
      const ids: number[] = [];
      for (let i = gen.startId; i <= gen.endId; i++) {
        ids.push(i);
      }
      return {
        gen,
        stats: calculateProgressStats(entries, ids),
      };
    });
  }, [entries]);

  // 3. Simple list of all Pokémon mapped from paginated queries
  const pokemonList = data?.pages.flat() || [];

  // 4. Calculate Type Progress based on loaded/caught Pokémon
  const typeProgress = React.useMemo(() => {
    const counts: Record<string, { caught: number; total: number }> = {};

    // Initialize all 18 types
    POKEMON_TYPES.forEach((type) => {
      counts[type] = { caught: 0, total: 0 };
    });

    pokemonList.forEach((p) => {
      const types = p.types || [];
      const isCaught = entries[p.id]?.caught || false;

      types.forEach((t) => {
        const typeLower = t.toLowerCase();
        if (counts[typeLower]) {
          counts[typeLower].total += 1;
          if (isCaught) {
            counts[typeLower].caught += 1;
          }
        }
      });
    });

    return counts;
  }, [pokemonList, entries]);

  // Filter Pokémon according to Living Dex seen/caught status client-side
  const filteredPokemonList = React.useMemo(() => {
    return pokemonList.filter((pokemon) => {
      const entry = entries[pokemon.id] || { seen: false, caught: false };
      if (filterMode === "seen") return entry.seen;
      if (filterMode === "unseen") return !entry.seen;
      if (filterMode === "caught") return entry.caught;
      if (filterMode === "uncaught") return !entry.caught;
      return true;
    });
  }, [pokemonList, entries, filterMode]);

  const handleMarkAllSeen = () => {
    if (confirm("Are you sure you want to mark all 1025 Pokémon as Seen?")) {
      const ids: number[] = [];
      for (let i = 1; i <= 1025; i++) ids.push(i);
      useLivingDexStore.getState().bulkMarkSeen(ids, true);
      toast.success("Marked all Pokémon as Seen.");
    }
  };

  const handleMarkAllCaught = () => {
    if (confirm("Are you sure you want to mark all 1025 Pokémon as Caught?")) {
      const ids: number[] = [];
      for (let i = 1; i <= 1025; i++) ids.push(i);
      useLivingDexStore.getState().bulkMarkCaught(ids, true);
      toast.success("Marked all Pokémon as Caught/Collected.");
    }
  };

  return (
    <div className="space-y-8">
      {/* National Dex & Bulk Progression Summary Card */}
      <Card className="bg-gradient-to-br from-primary/5 via-card to-card border-border/50 overflow-hidden relative">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                National Pokédex Completion
              </h3>
              <p className="text-sm text-muted-foreground max-w-xl">
                Track your ultimate goal: collecting all 1025 unique species of Pokémon from Generations I through IX.
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-9 text-xs" onClick={handleMarkAllSeen}>
                All Seen
              </Button>
              <Button variant="outline" size="sm" className="h-9 text-xs" onClick={handleMarkAllCaught}>
                All Caught
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 text-xs text-destructive hover:bg-destructive/10"
                onClick={() => {
                  if (confirm("Are you sure you want to clear your entire Living Pokédex progress?")) {
                    clearLivingDex();
                    toast.success("Cleared Living Pokédex progress.");
                  }
                }}
              >
                Clear Progress
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            {/* Stats Circular block */}
            <div className="p-4 bg-background/50 rounded-2xl border text-center space-y-1 md:col-span-1">
              <div className="text-4xl font-black text-primary">{nationalProgress.percentage}%</div>
              <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Overall Collected
              </div>
            </div>

            {/* Completion Progress details */}
            <div className="space-y-4 md:col-span-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm font-bold">
                  <span>Caught / Collected Species</span>
                  <span className="font-mono text-xs">
                    {nationalProgress.caught} / {nationalProgress.total}
                  </span>
                </div>
                <Progress value={nationalProgress.caught} max={nationalProgress.total} className="h-3" />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-sm font-bold text-muted-foreground">
                  <span>Seen Species</span>
                  <span className="font-mono text-xs">
                    {nationalProgress.seen} / {nationalProgress.total}
                  </span>
                </div>
                <Progress
                  value={nationalProgress.seen}
                  max={nationalProgress.total}
                  className="h-2"
                  indicatorClassName="bg-blue-400"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generation Progression Breakdown */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
          <BookOpen className="h-4 w-4 text-primary" />
          Progression by Generation
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {genProgressList.map(({ gen, stats }) => (
            <Card key={gen.id} className="bg-card/40 border-border/50 backdrop-blur-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h5 className="font-black text-sm">{gen.name}</h5>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-muted">
                    #{gen.startId} - #{gen.endId}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium text-muted-foreground">
                    <span>Collected: {stats.caught} / {stats.total}</span>
                    <span className="font-bold text-foreground">{stats.percentage}%</span>
                  </div>
                  <Progress value={stats.caught} max={stats.total} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Type-based Completion Progress */}
      {pokemonList.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-primary" />
            Progression by Type (Current Pool)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {Object.entries(typeProgress).map(([type, counts]) => {
              const pct = counts.total > 0 ? Math.round((counts.caught / counts.total) * 100) : 0;
              return (
                <div key={type} className="p-3 bg-card/40 rounded-xl border border-border/40 space-y-1.5 text-center">
                  <div className="text-xs font-black uppercase text-foreground/80 capitalize">{type}</div>
                  <div className="text-xs font-mono font-bold text-muted-foreground">
                    {counts.caught} / {counts.total}
                  </div>
                  <Progress value={counts.caught} max={counts.total} className="h-1.5" />
                  <div className="text-[9px] font-bold text-muted-foreground/60">{pct}% complete</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Checklist Interactive Area */}
      <div className="space-y-6 pt-4 border-t">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-muted/20 p-4 rounded-xl border border-border/50">
          <div className="flex flex-col gap-1.5">
            <h4 className="text-lg font-black tracking-tight">Interactive Dex Checklist</h4>
            <p className="text-xs text-muted-foreground">
              Search and filter Pokémon to quickly mark them as seen or caught directly.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            {/* Filter mode toggles */}
            <div className="flex items-center gap-1 rounded-md border p-1 bg-card">
              {(["all", "seen", "unseen", "caught", "uncaught"] as const).map((m) => (
                <Button
                  key={m}
                  variant={filterMode === m ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 text-[10px] uppercase font-bold px-2.5 rounded-sm"
                  onClick={() => setFilterMode(m)}
                >
                  {m}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Paginated Pokemon list with checklist actions */}
        {isLoading ? (
          <PokemonSkeletonGrid count={8} />
        ) : filteredPokemonList.length === 0 ? (
          <EmptyState
            title="No matching species"
            description="We couldn't find any species matching your criteria."
            icon={<Filter className="h-12 w-12 text-muted-foreground/30" />}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPokemonList.map((pokemon) => {
                const entry = entries[pokemon.id] || { seen: false, caught: false };
                return (
                  <Card
                    key={pokemon.id}
                    className={`overflow-hidden border-border/50 transition-all ${
                      entry.caught
                        ? "bg-green-500/5 border-green-500/20"
                        : entry.seen
                        ? "bg-blue-500/5 border-blue-500/20"
                        : "bg-card/40"
                    }`}
                  >
                    <div className="p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={pokemon.image}
                          alt={pokemon.name}
                          className="h-10 w-10 object-contain drop-shadow-sm flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-[9px] font-mono font-bold text-muted-foreground/60">
                            #{pokemon.id.toString().padStart(4, "0")}
                          </div>
                          <h5 className="text-sm font-black capitalize truncate">{pokemon.name}</h5>
                        </div>
                      </div>

                      {/* Seen & Caught checkboxes / quick actions */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 rounded-full ${
                            entry.seen
                              ? "text-blue-500 bg-blue-500/10 hover:bg-blue-500/15"
                              : "text-muted-foreground/50 hover:bg-muted"
                          }`}
                          onClick={() => {
                            markSeen(pokemon.id, !entry.seen);
                            toast.success(
                              !entry.seen
                                ? `Marked ${pokemon.name} as Seen.`
                                : `Removed ${pokemon.name} from Seen.`
                            );
                          }}
                          title={entry.seen ? "Mark Unseen" : "Mark Seen"}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 rounded-full ${
                            entry.caught
                              ? "text-green-500 bg-green-500/10 hover:bg-green-500/15"
                              : "text-muted-foreground/50 hover:bg-muted"
                          }`}
                          onClick={() => {
                            markCaught(pokemon.id, !entry.caught);
                            toast.success(
                              !entry.caught
                                ? `Marked ${pokemon.name} as Caught.`
                                : `Removed ${pokemon.name} from Caught.`
                            );
                          }}
                          title={entry.caught ? "Mark Uncaught" : "Mark Caught/Collected"}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <InfiniteLoader
              onLoadMore={fetchNextPage}
              hasNextPage={!!hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
