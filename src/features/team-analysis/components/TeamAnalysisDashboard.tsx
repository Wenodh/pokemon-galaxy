"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { analyzeTeam } from "../domain/analyzer";
import { PokemonDetails } from "@/features/pokemon/types";
import { AnalysisOverviewCard } from "./AnalysisOverviewCard";
import { RecommendationList } from "@/features/team-recommendations/components/RecommendationList";
import { generateRecommendations } from "@/features/team-recommendations/domain/recommendation-engine";
import { SuggestionList } from "@/features/team-suggestions/components/SuggestionList";
import { getSuggestions } from "@/features/team-suggestions/domain/suggestion-engine";
import { useActiveTeam } from "@/features/team/hooks/useActiveTeam";
import { CoverageCard } from "./CoverageCard";
import { WeaknessCard } from "./WeaknessCard";
import { ResistanceCard } from "./ResistanceCard";
import { StatsCard } from "./StatsCard";
import { RolesCard } from "./RolesCard";
import { WarningsCard } from "./WarningsCard";
import { DuplicateTypesCard } from "./DuplicateTypesCard";
import { AnalysisSection } from "./AnalysisSection";
import { ChartSkeleton } from "./ChartSkeleton";
import { AlertCircle, LayoutDashboard, BarChart3, PieChart, Activity } from "lucide-react";
import { TeamAnalysis } from "../types/analysis.types";

// Dynamic imports for charts
const TeamRadarChart = dynamic(() => import("./TeamRadarChart").then(mod => mod.TeamRadarChart), {
    loading: () => <ChartSkeleton />,
    ssr: false
});
const TypeDistributionChart = dynamic(() => import("./TypeDistributionChart").then(mod => mod.TypeDistributionChart), {
    loading: () => <ChartSkeleton />,
    ssr: false
});
const StatComparisonChart = dynamic(() => import("./StatComparisonChart").then(mod => mod.StatComparisonChart), {
    loading: () => <ChartSkeleton />,
    ssr: false
});
const CoverageMatrix = dynamic(() => import("./CoverageMatrix").then(mod => mod.CoverageMatrix), {
    loading: () => <ChartSkeleton />,
    ssr: false
});
const WeaknessMatrix = dynamic(() => import("./WeaknessMatrix").then(mod => mod.WeaknessMatrix), {
    loading: () => <ChartSkeleton />,
    ssr: false
});

interface TeamAnalysisDashboardProps {
  pokemon: PokemonDetails[];
  isLoading?: boolean;
  isActive?: boolean;
}

export function TeamAnalysisDashboard({ pokemon, isLoading, isActive = true }: TeamAnalysisDashboardProps) {
  const { activeTeam } = useActiveTeam();
  const lastAnalysis = useRef<TeamAnalysis | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Defer heavy computation until the tab is active
  const analysis = useMemo(() => {
    if (!isActive && lastAnalysis.current) {
      return lastAnalysis.current;
    }

    if (!isActive && !lastAnalysis.current) {
      return null;
    }

    const result = analyzeTeam(pokemon);
    lastAnalysis.current = result;
    return result;
  }, [pokemon, isActive]);

  const recommendations = useMemo(() => {
    if (!analysis) return [];
    return generateRecommendations(analysis, pokemon.length);
  }, [analysis, pokemon.length]);

  const suggestions = useMemo(() => {
    if (!activeTeam || !analysis || !recommendations) return [];
    try {
        return getSuggestions(activeTeam, analysis, recommendations);
    } catch (e) {
        console.error("Suggestion Engine Error:", e);
        return [];
    }
  }, [activeTeam, analysis, recommendations]);

  const hasEmittedForActiveSession = useRef(false);

  useEffect(() => {
    if (!isActive) {
      hasEmittedForActiveSession.current = false;
    } else if (isActive && analysis && activeTeam && pokemon.length > 0 && !hasEmittedForActiveSession.current) {
      hasEmittedForActiveSession.current = true;
      import("../../trainer/application/event-service").then(({ TrainerEventService }) => {
        TrainerEventService.emit({
          type: "TEAM_ANALYZED",
          name: activeTeam.name,
          score: analysis.overallScore,
        });
      }).catch((err) => {
        console.error("TrainerEventService TEAM_ANALYZED emit failed silently", err);
      });
    }
  }, [isActive, analysis, activeTeam, pokemon]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const isPreliminary = pokemon.length < 2;

  const coverageSummary = useMemo(() => {
    if (!analysis) return "";
    const coveredCount = analysis.offensiveCoverage.filter(c => c.effectiveness > 0).length;
    return `Your team hits ${coveredCount} out of 18 types super-effectively.`;
  }, [analysis]);

  const defensiveSummary = useMemo(() => {
    if (!analysis) return "";
    const severeWeak = analysis.weaknesses.filter(w => w.count >= 3).length;
    if (severeWeak === 0) return "Your team has no major shared weaknesses.";
    return `Your team has ${severeWeak} significant shared weaknesses that could be exploited.`;
  }, [analysis]);

  if (!isHydrated) return null;

  if (pokemon.length === 0 && !isLoading) {
    return (
      <div className="space-y-16 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <section className="space-y-6">
          <RecommendationList recommendations={recommendations} />
        </section>

        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/60 p-12 text-center bg-muted/5">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted/50">
            <LayoutDashboard className="h-7 w-7 text-muted-foreground/50" />
          </div>
          <h3 className="font-bold text-lg mb-1">No Analysis Available</h3>
          <p className="mb-6 text-sm text-muted-foreground max-w-[200px]">
            Add Pokémon to your team to see analysis results.
          </p>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-16 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="space-y-12">
        <RecommendationList recommendations={recommendations} />
        <SuggestionList suggestions={suggestions} />
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b pb-2">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-black tracking-tight">Team Overview</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnalysisOverviewCard
            score={analysis.overallScore}
            breakdown={analysis.scoreBreakdown}
            isPreliminary={isPreliminary}
            />
            <WarningsCard warnings={analysis.warnings} />
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center gap-2 border-b pb-2">
            <PieChart className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-black tracking-tight">Analysis Summaries</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-10">
            <AnalysisSection
                title="Coverage Quick-View"
                description="Summary of your team's offensive and defensive presence."
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
      </section>

      <section className="space-y-10">
        <div className="flex items-center gap-2 border-b pb-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-black tracking-tight">Advanced Visualizations</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
                <TeamRadarChart stats={analysis.averageStats} />
                <p className="text-sm text-muted-foreground italic px-2">
                    The radar chart shows how your team averages across the 6 core stats on a scale of 0 to 255.
                </p>
            </div>
            <div className="space-y-4">
                <TypeDistributionChart distribution={analysis.typeDistribution} />
                <p className="text-sm text-muted-foreground italic px-2">
                    Distribution of all types present in your team, including primary and secondary types.
                </p>
            </div>
        </div>

        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <CoverageMatrix coverage={analysis.offensiveCoverage} />
                    <p className="text-sm text-muted-foreground italic px-2">
                        {coverageSummary}
                    </p>
                </div>
                <div className="space-y-4">
                    <WeaknessMatrix
                        weaknesses={analysis.weaknesses}
                        resistances={analysis.resistances}
                        immunities={analysis.immunities}
                    />
                    <p className="text-sm text-muted-foreground italic px-2">
                        {defensiveSummary}
                    </p>
                </div>
            </div>
        </div>

        <div className="space-y-4">
            <StatComparisonChart members={analysis.individualStats as any} />
            <p className="text-sm text-muted-foreground italic px-2">
                Select a stat to compare values across all individual team members.
            </p>
        </div>
      </section>

      {isPreliminary && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-blue-800 dark:text-blue-300">Preliminary Analysis</p>
            <p className="text-xs text-blue-700/80 dark:text-blue-400/80 leading-relaxed">
              Analysis results and visualizations are more accurate with a full team. Currently displaying metrics for {pokemon.length} Pokémon.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
