"use client";

import { useMemo } from "react";
import { analyzeTeam } from "../domain/analyzer";
import { PokemonDetails } from "@/features/pokemon/types";
import { AnalysisOverviewCard } from "./AnalysisOverviewCard";
import { CoverageCard } from "./CoverageCard";
import { WeaknessCard } from "./WeaknessCard";
import { ResistanceCard } from "./ResistanceCard";
import { StatsCard } from "./StatsCard";
import { RolesCard } from "./RolesCard";
import { WarningsCard } from "./WarningsCard";
import { DuplicateTypesCard } from "./DuplicateTypesCard";
import { AnalysisSection } from "./AnalysisSection";
import { AlertCircle, LayoutDashboard } from "lucide-react";

interface TeamAnalysisDashboardProps {
  pokemon: PokemonDetails[];
  isLoading?: boolean;
}

export function TeamAnalysisDashboard({ pokemon, isLoading }: TeamAnalysisDashboardProps) {
  const analysis = useMemo(() => analyzeTeam(pokemon), [pokemon]);
  const isPreliminary = pokemon.length < 2;

  if (pokemon.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/60 p-12 text-center bg-muted/5">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted/50">
          <LayoutDashboard className="h-7 w-7 text-muted-foreground/50" />
        </div>
        <h3 className="font-bold text-lg mb-1">No Analysis Available</h3>
        <p className="mb-6 text-sm text-muted-foreground max-w-[200px]">
          Add Pokémon to your team to see analysis results.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Section: Overview and Warnings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnalysisOverviewCard
          score={analysis.overallScore}
          breakdown={analysis.scoreBreakdown}
          isPreliminary={isPreliminary}
        />
        <WarningsCard warnings={analysis.warnings} />
      </div>

      {/* Main Analysis Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left/Main Column */}
        <div className="lg:col-span-8 space-y-10">
          <AnalysisSection
            title="Coverage Dashboard"
            description="Analysis of your team's offensive presence and defensive vulnerabilities across all types."
          >
            <CoverageCard
              offensive={analysis.offensiveCoverage}
              weaknesses={analysis.weaknesses}
              resistances={analysis.resistances}
              immunities={analysis.immunities}
            />
          </AnalysisSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <AnalysisSection title="Shared Weaknesses">
              <WeaknessCard weaknesses={analysis.weaknesses} />
            </AnalysisSection>
            <AnalysisSection title="Team Resistances">
              <ResistanceCard
                resistances={analysis.resistances}
                immunities={analysis.immunities}
              />
            </AnalysisSection>
          </div>
        </div>

        {/* Right/Side Column */}
        <div className="lg:col-span-4 space-y-10">
          <AnalysisSection title="Average Statistics">
            <StatsCard stats={analysis.averageStats} />
          </AnalysisSection>

          <AnalysisSection title="Pokémon Roles">
            <RolesCard roles={analysis.pokemonRoles} />
          </AnalysisSection>

          <AnalysisSection title="Type Diversity">
            <DuplicateTypesCard duplicates={analysis.duplicateTypes} />
          </AnalysisSection>
        </div>
      </div>

      {isPreliminary && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-blue-800 dark:text-blue-300">Preliminary Analysis</p>
            <p className="text-xs text-blue-700/80 dark:text-blue-400/80 leading-relaxed">
              Analysis results are more accurate with a full team. Currently displaying metrics for {pokemon.length} Pokémon.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
