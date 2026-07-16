"use client";

import * as React from "react";
import { useLivingDexStore } from "../store/living-dex.store";
import { useLivingDexActions } from "../hooks/use-living-dex-actions";
import { GENERATIONS, legendaryIds, mythicalIds } from "../constants";
import { REGIONAL_DEXES } from "../constants/regional-dex";
import { calculateProgressStats } from "../utils/statistics";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePokemonList } from "@/features/pokedex/hooks/use-pokemon-list";
import { useCollectionPokemon } from "@/features/collection/hooks/use-collection-pokemon";
import { PokemonSkeletonGrid } from "@/features/pokedex/components/pokemon-skeleton";
import { VirtualizedPokemonGrid } from "@/features/pokedex/components/virtualized-pokemon-grid";
import { EmptyState } from "@/components/common/empty-state";
import { toast } from "sonner";
import {
  Search,
  Eye,
  Filter,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function LivingDexDashboard() {
  const entries = useLivingDexStore((state) => state.entries);
  const { clearLivingDex } = useLivingDexActions();

  const [activeTab, setActiveTab] = React.useState("overview");
  const [selectedDexId, setSelectedDexId] = React.useState("national");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterMode, setFilterMode] = React.useState<"all" | "seen" | "unseen" | "caught" | "uncaught">("all");
  const [sortBy, setSortBy] = React.useState<"number" | "name" | "status" | "recent-seen" | "recent-caught">("number");
  const [showMissingOnly, setShowMissingOnly] = React.useState(false);

  // Active Dex configuration
  const activeDex = React.useMemo(() => {
    return REGIONAL_DEXES.find((d) => d.id === selectedDexId) || REGIONAL_DEXES[0];
  }, [selectedDexId]);

  // General National Stats for dashboard
  const nationalProgress = React.useMemo(() => {
    const allIds = Array.from({ length: 1025 }, (_, i) => i + 1);
    return calculateProgressStats(entries, allIds);
  }, [entries]);

  // 1. Paginated Query for National Dex Checklist (staged infinite loader)
  const isNational = selectedDexId === "national";
  const {
    data: nationalData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isNationalLoading,
  } = usePokemonList({ search: searchQuery }, 20);

  // 2. Full Fetch Query for Regional Dexes (to allow 100% correct sorting/filtering client-side)
  const { data: regionalDetails, isLoading: isRegionalLoading } = useCollectionPokemon(
    isNational ? [] : activeDex.pokemonIds
  );

  const isLoading = isNational ? isNationalLoading : isRegionalLoading;

  // Recently Caught & Recently Seen
  const recentlyCaught = React.useMemo(() => {
    return Object.values(entries)
      .filter((e) => e.caught && e.firstCaughtAt)
      .sort((a, b) => (b.firstCaughtAt || 0) - (a.firstCaughtAt || 0))
      .slice(0, 5);
  }, [entries]);

  const recentlySeen = React.useMemo(() => {
    return Object.values(entries)
      .filter((e) => e.seen && e.firstSeenAt)
      .sort((a, b) => (b.firstSeenAt || 0) - (a.firstSeenAt || 0))
      .slice(0, 5);
  }, [entries]);

  // Hydrate checklist Pokémon list
  const rawPokemonList = React.useMemo(() => {
    if (isNational) {
      return nationalData?.pages.flat() || [];
    } else {
      if (!regionalDetails) return [];
      return regionalDetails.map((p) => ({
        id: p.id,
        name: p.name,
        types: p.types,
        image: p.image,
        stats: p.stats,
      }));
    }
  }, [isNational, nationalData, regionalDetails]);

  // Missing from currently loaded pool
  const missingFromLoaded = React.useMemo(() => {
    return rawPokemonList.filter((p) => !entries[p.id]?.caught);
  }, [rawPokemonList, entries]);

  // Apply filters and search
  const filteredAndSortedPokemon = React.useMemo(() => {
    let list = [...rawPokemonList];

    // Client-side search (if regional)
    if (!isNational && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.id.toString() === q
      );
    }

    // Filter statuses
    list = list.filter((p) => {
      const entry = entries[p.id] || { seen: false, caught: false };

      if (showMissingOnly && entry.caught) return false;

      if (filterMode === "seen") return entry.seen;
      if (filterMode === "unseen") return !entry.seen;
      if (filterMode === "caught") return entry.caught;
      if (filterMode === "uncaught") return !entry.caught;

      return true;
    });

    // Sorting
    list.sort((a, b) => {
      const entryA = entries[a.id];
      const entryB = entries[b.id];

      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "status") {
        // Status Sort: Caught first, then Seen, then Not Seen
        const score = (entry: any) => {
          if (!entry) return 0;
          if (entry.caught) return 3;
          if (entry.seen) return 2;
          return 1;
        };
        const scoreA = score(entryA);
        const scoreB = score(entryB);
        if (scoreB !== scoreA) {
          return scoreB - scoreA; // Descending score (Caught > Seen > Not Seen)
        }
        return a.id - b.id; // National number ascending tiebreaker
      }

      if (sortBy === "recent-seen") {
        const timeA = entryA?.firstSeenAt || 0;
        const timeB = entryB?.firstSeenAt || 0;
        if (timeB !== timeA) return timeB - timeA;
        return a.id - b.id;
      }

      if (sortBy === "recent-caught") {
        const timeA = entryA?.firstCaughtAt || 0;
        const timeB = entryB?.firstCaughtAt || 0;
        if (timeB !== timeA) return timeB - timeA;
        return a.id - b.id;
      }

      // Default: National Number
      return a.id - b.id;
    });

    return list;
  }, [rawPokemonList, searchQuery, filterMode, showMissingOnly, sortBy, entries, isNational]);

  // Missing Pokémon View Data
  const missingPokemonList = React.useMemo(() => {
    // Collect all IDs not caught yet
    const missingIds: number[] = [];
    for (let i = 1; i <= 1025; i++) {
      if (!entries[i]?.caught) {
        missingIds.push(i);
      }
    }
    return missingIds;
  }, [entries]);

  // Statistics summaries
  const legendaryProgress = React.useMemo(() => {
    const list = Array.from(legendaryIds);
    return calculateProgressStats(entries, list);
  }, [entries]);

  const mythicalProgress = React.useMemo(() => {
    const list = Array.from(mythicalIds);
    return calculateProgressStats(entries, list);
  }, [entries]);

  const genProgressBreakdown = React.useMemo(() => {
    return GENERATIONS.map((gen) => {
      const ids: number[] = [];
      for (let i = gen.startId; i <= gen.endId; i++) ids.push(i);
      return {
        gen,
        stats: calculateProgressStats(entries, ids),
      };
    });
  }, [entries]);

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
    <div className="space-y-6">
      {/* Tab control headers */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="grid">Checklist</TabsTrigger>
          <TabsTrigger value="missing">Missing</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        {/* --- TAB 1: OVERVIEW & DASHBOARD --- */}
        <TabsContent value="overview" className="focus-visible:outline-none space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card/40 border-border/50">
              <CardContent className="p-5 flex flex-col justify-center min-h-[100px]">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Overall Caught
                </span>
                <span className="text-3xl font-black text-foreground mt-1">
                  {nationalProgress.caught} / 1025
                </span>
                <span className="text-xs text-primary font-bold mt-1">
                  {nationalProgress.percentage}% Complete
                </span>
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-border/50">
              <CardContent className="p-5 flex flex-col justify-center min-h-[100px]">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Species Seen
                </span>
                <span className="text-3xl font-black text-foreground mt-1">
                  {nationalProgress.seen} / 1025
                </span>
                <span className="text-xs text-blue-500 font-bold mt-1">
                  {Math.round((nationalProgress.seen / 1025) * 100)}% Encountered
                </span>
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-border/50">
              <CardContent className="p-5 flex flex-col justify-center min-h-[100px]">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Remaining Pokémon
                </span>
                <span className="text-3xl font-black text-foreground mt-1">
                  {1025 - nationalProgress.caught}
                </span>
                <span className="text-xs text-yellow-500 font-bold mt-1">
                  Left to catch
                </span>
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-border/50">
              <CardContent className="p-5 flex flex-col justify-center min-h-[100px]">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Current Streak
                </span>
                <span className="text-xl font-bold text-muted-foreground mt-2">
                  Coming Soon
                </span>
                <span className="text-[10px] text-muted-foreground/60 mt-1">
                  Future streak tracker
                </span>
              </CardContent>
            </Card>
          </div>

          {/* Quick Action buttons */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" size="sm" className="h-9 text-xs" onClick={handleMarkAllSeen}>
              Mark All Seen
            </Button>
            <Button variant="outline" size="sm" className="h-9 text-xs" onClick={handleMarkAllCaught}>
              Mark All Caught
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

          {/* Progress bar visualizers */}
          <Card className="bg-card/40 border-border/50 p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span>National Pokédex Collected</span>
                <span className="font-mono text-xs">{nationalProgress.caught} / 1025</span>
              </div>
              <Progress value={nationalProgress.caught} max={1025} className="h-3 bg-muted" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold text-muted-foreground">
                <span>Species Encountered / Seen</span>
                <span className="font-mono text-xs">{nationalProgress.seen} / 1025</span>
              </div>
              <Progress
                value={nationalProgress.seen}
                max={1025}
                className="h-2 bg-muted"
                indicatorClassName="bg-blue-500"
              />
            </div>
          </Card>

          {/* Recently Caught & Recently Seen Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/40 border-border/50">
              <CardContent className="p-5 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-green-500" />
                  Recently Caught
                </h4>
                {recentlyCaught.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-4">No recent catches recorded.</p>
                ) : (
                  <div className="space-y-2">
                    {recentlyCaught.map((e) => (
                      <div
                        key={e.pokemonId}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/20 border border-border/30 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${e.pokemonId}.png`}
                            alt=""
                            className="h-8 w-8 object-contain"
                          />
                          <span className="text-xs font-bold font-mono text-muted-foreground">
                            #{e.pokemonId.toString().padStart(4, "0")}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {e.firstCaughtAt ? new Date(e.firstCaughtAt).toLocaleDateString() : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-border/50">
              <CardContent className="p-5 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-blue-500" />
                  Recently Seen
                </h4>
                {recentlySeen.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-4">No recent encounters recorded.</p>
                ) : (
                  <div className="space-y-2">
                    {recentlySeen.map((e) => (
                      <div
                        key={e.pokemonId}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/20 border border-border/30 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${e.pokemonId}.png`}
                            alt=""
                            className="h-8 w-8 object-contain"
                          />
                          <span className="text-xs font-bold font-mono text-muted-foreground">
                            #{e.pokemonId.toString().padStart(4, "0")}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {e.firstSeenAt ? new Date(e.firstSeenAt).toLocaleDateString() : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- TAB 2: INTERACTIVE CHECKLIST --- */}
        <TabsContent value="grid" className="focus-visible:outline-none space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-muted/20 p-4 rounded-xl border border-border/50">
            <div className="flex flex-wrap gap-3 items-center flex-1">
              {/* Dex Registry select dropdown */}
              <div className="flex items-center gap-2">
                <select
                  id="dex-select"
                  value={selectedDexId}
                  onChange={(e) => {
                    setSelectedDexId(e.target.value);
                    setSearchQuery("");
                  }}
                  className="h-9 text-xs rounded-lg border border-border bg-background px-3 font-black focus:outline-none text-primary"
                >
                  {REGIONAL_DEXES.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.pokemonIds.length} Pokémon)
                    </option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div className="relative flex-1 min-w-[150px] max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="ID or species name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-9 text-xs"
                />
              </div>

              {/* Status select filter */}
              <select
                value={filterMode}
                onChange={(e: any) => setFilterMode(e.target.value)}
                className="h-9 text-xs rounded-lg border border-border bg-background px-3 font-medium focus:outline-none"
              >
                <option value="all">All Pokémon</option>
                <option value="seen">Seen Only</option>
                <option value="unseen">Not Seen Only</option>
                <option value="caught">Caught Only</option>
                <option value="uncaught">Not Caught Only</option>
              </select>

              {/* Sorting select */}
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="h-9 text-xs rounded-lg border border-border bg-background px-3 font-medium focus:outline-none"
              >
                <option value="number">Sort: National ID</option>
                <option value="name">Sort: Name (A-Z)</option>
                <option value="status">Sort: Completion Status</option>
                <option value="recent-seen">Sort: Recently Seen</option>
                <option value="recent-caught">Sort: Recently Caught</option>
              </select>
            </div>

            {/* Quick checkbox toggles */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-bold cursor-pointer text-muted-foreground hover:text-foreground">
                <input
                  type="checkbox"
                  checked={showMissingOnly}
                  onChange={(e) => setShowMissingOnly(e.target.checked)}
                  className="h-4 w-4 rounded accent-primary cursor-pointer"
                />
                Show Missing Only
              </label>
            </div>
          </div>

          {/* Checklist Grid of Cards */}
          {isLoading ? (
            <PokemonSkeletonGrid count={8} />
          ) : filteredAndSortedPokemon.length === 0 ? (
            <EmptyState
              title="No Pokémon matching criteria"
              description="No species matching your filters found in the current Pokédex selection."
              icon={<Filter className="h-12 w-12 text-muted-foreground/30" />}
            />
          ) : (
            <>
              <VirtualizedPokemonGrid
                pokemon={filteredAndSortedPokemon}
                density="compact"
                className="h-[600px]"
              />

              {isNational && hasNextPage && (
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? "Loading more..." : "Load More"}
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* --- TAB 3: MISSING POKÉMON --- */}
        <TabsContent value="missing" className="focus-visible:outline-none space-y-6">
          <div className="p-4 bg-muted/20 border border-border/50 rounded-xl flex items-center justify-between">
            <div>
              <h4 className="font-black text-sm">Missing / Remaining Species</h4>
              <p className="text-xs text-muted-foreground">
                You have {missingPokemonList.length} species remaining out of 1025 to complete your Living Dex.
              </p>
            </div>
            <div className="text-2xl font-black text-yellow-500">{missingPokemonList.length} Missing</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GENERATIONS.map((gen) => {
              const idsInRange = Array.from({ length: gen.endId - gen.startId + 1 }, (_, i) => gen.startId + i);
              const missingInGen = idsInRange.filter((id) => !entries[id]?.caught).length;
              const pctComplete = Math.round(((idsInRange.length - missingInGen) / idsInRange.length) * 100);

              return (
                <Card key={gen.id} className="bg-card/40 border-border/50">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h5 className="font-bold text-xs">{gen.name}</h5>
                      <span className="text-xs font-bold text-yellow-500">{missingInGen} Left</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                        <span>Progress: {idsInRange.length - missingInGen} / {idsInRange.length}</span>
                        <span>{pctComplete}%</span>
                      </div>
                      <Progress value={idsInRange.length - missingInGen} max={idsInRange.length} className="h-1.5" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="space-y-3 pt-4 border-t">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Missing Species in Current Selection ({missingFromLoaded.length})
            </h4>

            {missingFromLoaded.length === 0 ? (
              <p className="text-sm text-muted-foreground italic py-4">No missing Pokémon in this view!</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {missingFromLoaded.slice(0, 24).map((p) => (
                  <Link
                    key={p.id}
                    href={`/pokemon/${p.name}`}
                    className="p-3 bg-card border border-border hover:border-primary/40 hover:scale-105 transition-all rounded-xl text-center flex flex-col items-center justify-center relative group cursor-pointer"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`}
                      alt={p.name}
                      className="h-12 w-12 object-contain group-hover:scale-110 transition-transform grayscale"
                    />
                    <div className="text-[10px] font-mono font-bold text-muted-foreground mt-1.5 truncate w-full capitalize">
                      {p.name}
                    </div>
                    <div className="text-[9px] font-mono text-muted-foreground/60 mt-0.5">
                      #{p.id.toString().padStart(4, "0")}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* --- TAB 4: COMPREHENSIVE STATISTICS --- */}
        <TabsContent value="statistics" className="focus-visible:outline-none space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/40 border-border/50">
              <CardContent className="p-5 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Completion by Category
                </h4>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Legendary Species</span>
                      <span className="font-mono">{legendaryProgress.caught} / {legendaryProgress.total}</span>
                    </div>
                    <Progress value={legendaryProgress.caught} max={legendaryProgress.total} className="h-2" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Mythical Species</span>
                      <span className="font-mono">{mythicalProgress.caught} / {mythicalProgress.total}</span>
                    </div>
                    <Progress value={mythicalProgress.caught} max={mythicalProgress.total} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-border/50">
              <CardContent className="p-5 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Completion by Generation
                </h4>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {genProgressBreakdown.map(({ gen, stats }) => (
                    <div key={gen.id} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span>{gen.name}</span>
                        <span>{stats.caught} / {stats.total} ({stats.percentage}%)</span>
                      </div>
                      <Progress value={stats.caught} max={stats.total} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
