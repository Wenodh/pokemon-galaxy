"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { PageLayout } from "@/components/layout/page-layout";
import { Container } from "@/components/common/container";
import { CreateTeamDialog } from "../components/CreateTeamDialog";
import { RenameTeamDialog } from "../components/RenameTeamDialog";
import { DeleteTeamDialog } from "../components/DeleteTeamDialog";
import { TeamSelector } from "../components/TeamSelector";
import { TeamComposition } from "../components/TeamComposition";
import { PokemonSearch } from "@/features/pokedex/components/pokemon-search";
import { PokemonGrid } from "@/features/pokedex/components/pokemon-grid";
import { PokemonCard } from "@/features/pokedex/components/pokemon-card";
import { InfiniteLoader } from "@/features/pokedex/components/infinite-loader";
import { PokemonSkeletonGrid } from "@/features/pokedex/components/pokemon-skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { useTeamDialogs } from "../hooks/useTeamDialogs";
import { useActiveTeam } from "../hooks/useActiveTeam";
import { useTeamPokemon } from "../hooks/useTeamPokemon";
import { usePokemonList } from "@/features/pokedex/hooks/use-pokemon-list";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  SearchX,
  Plus,
  Pencil,
  Copy,
  Trash,
  Settings2,
  LayoutDashboard,
  Wrench,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTeams } from "../hooks/useTeams";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Lazy-load the Analysis Dashboard
const TeamAnalysisDashboard = dynamic(
  () => import("@/features/team-analysis/components/TeamAnalysisDashboard").then(mod => mod.TeamAnalysisDashboard),
  {
    loading: () => (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading Analysis Dashboard...</p>
      </div>
    )
  }
);

function ExplorerContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = usePokemonList({ search });

  if (isError) {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive mb-4">Failed to load Pokémon.</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  const allPokemon = data?.pages.flat() || [];
  const isEmpty = !isLoading && allPokemon.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold tracking-tight">Pokémon Explorer</h2>
        <div className="flex items-center gap-2">
            <PokemonSearch className="w-full sm:w-[300px]" />
        </div>
      </div>

      {isLoading ? (
        <PokemonSkeletonGrid count={8} />
      ) : isEmpty ? (
        <EmptyState
          title="No Pokémon found"
          description={`No matching results for "${search}".`}
          icon={<SearchX className="h-6 w-6 text-muted-foreground" />}
        />
      ) : (
        <>
          <PokemonGrid density="compact">
            {allPokemon.map((pokemon, index) => (
              <PokemonCard
                key={`${pokemon.id}-${index}`}
                pokemon={pokemon}
                density="compact"
                mode="team-builder"
              />
            ))}
          </PokemonGrid>
          <InfiniteLoader
            onLoadMore={fetchNextPage}
            hasNextPage={!!hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </>
      )}
    </div>
  );
}

export const TeamsPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get("tab") || "builder";

  const {
    activeDialog,
    selectedTeam,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialogs,
  } = useTeamDialogs();

  const { activeTeam } = useActiveTeam();
  const { team: fullTeam, isLoading: isTeamLoading } = useTeamPokemon();
  const { duplicateTeam } = useTeams();

  const handleDuplicate = () => {
    if (activeTeam) {
      const result = duplicateTeam(activeTeam.id);
      if (result.ok) {
        toast.success("Team duplicated successfully.");
      }
    }
  };

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <PageLayout>
      <Container>
        <div className="flex flex-col gap-8 py-6">
          {/* Enhanced Header */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b pb-8">
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl font-black tracking-tight mb-1">Team Builder</h1>
                <p className="text-muted-foreground text-sm font-medium">
                  Assemble and manage your ultimate Pokémon team.
                </p>
              </div>

              {activeTeam && (
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-bold text-primary truncate max-w-[150px]">
                      {activeTeam.name}
                    </span>
                  </div>
                  <Badge variant="secondary" className="px-3 py-1 font-mono text-xs font-bold">
                    {activeTeam.pokemon.length} / 6 Pokémon
                  </Badge>

                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => openRenameDialog(activeTeam)}
                      title="Rename team"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <Settings2 className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                         <DropdownMenuItem onClick={handleDuplicate}>
                          <Copy className="mr-2 h-4 w-4" />
                          <span>Duplicate Team</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(activeTeam)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Delete Team</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 items-end">
                <TeamSelector
                onCreateOpen={openCreateDialog}
                onRename={openRenameDialog}
                onDelete={openDeleteDialog}
                />

                {activeTeam && (
                    <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full sm:w-auto">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="builder" className="gap-2">
                                <Wrench className="h-3.5 w-3.5" />
                                Builder
                            </TabsTrigger>
                            <TabsTrigger value="analysis" className="gap-2">
                                <LayoutDashboard className="h-3.5 w-3.5" />
                                Analysis
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                )}
            </div>
          </div>

          <div className="min-h-[600px]">
            {activeTeam ? (
                <Tabs value={currentTab} className="w-full">
                    <TabsContent value="builder" className="mt-0 space-y-0">
                         <div className="grid grid-cols-1 gap-12 lg:grid-cols-[340px_1fr]">
                            {/* Left Column: Team Composition */}
                            <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold tracking-tight">Team Slots</h2>
                            </div>
                            <TeamComposition />
                            </div>

                            {/* Right Column: Pokémon Explorer */}
                            <div className="min-w-0">
                            <Suspense fallback={<PokemonSkeletonGrid count={8} />}>
                                <ExplorerContent />
                            </Suspense>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="analysis" className="mt-0">
                        <TeamAnalysisDashboard
                            pokemon={(fullTeam?.pokemonDetails as any) || []}
                            isLoading={isTeamLoading}
                        />
                    </TabsContent>
                </Tabs>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/60 p-24 text-center bg-muted/5 max-w-2xl mx-auto">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted/50">
                    <Users className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="font-bold text-2xl mb-2">No Team Selected</h3>
                  <p className="mb-8 text-muted-foreground max-w-md">
                    Create a new team or select an existing one from the list above to start building and analyzing your squad.
                  </p>
                  <Button onClick={openCreateDialog} className="rounded-full px-8 py-6 text-lg font-bold">
                    <Plus className="mr-2 h-5 w-5" />
                    Create New Team
                  </Button>
                </div>
            )}
          </div>
        </div>

        <CreateTeamDialog
          open={activeDialog === "create"}
          onOpenChange={closeDialogs}
        />

        <RenameTeamDialog
          team={selectedTeam}
          open={activeDialog === "rename"}
          onOpenChange={closeDialogs}
        />

        <DeleteTeamDialog
          team={selectedTeam}
          open={activeDialog === "delete"}
          onOpenChange={closeDialogs}
        />
      </Container>
    </PageLayout>
  );
};
