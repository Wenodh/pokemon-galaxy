import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScoreBreakdown } from "../types/analysis.types";
import { SCORE_BANDS } from "../constants/analysis.constants";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AnalysisOverviewCardProps {
  score: number;
  breakdown: ScoreBreakdown;
  isPreliminary?: boolean;
}

export function AnalysisOverviewCard({
  score,
  breakdown,
  isPreliminary,
}: AnalysisOverviewCardProps) {
  const band = SCORE_BANDS.find((b) => score >= b.min) || SCORE_BANDS[SCORE_BANDS.length - 1];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Overall Team Rating</CardTitle>
          {isPreliminary && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
              Preliminary
            </span>
          )}
        </div>
        <CardDescription>
          A comprehensive evaluation based on coverage, balance, and stats.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center gap-2 mb-8">
          <div className="relative flex items-center justify-center">
            <svg className="h-32 w-32 -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="58"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                className="text-muted"
              />
              <circle
                cx="64"
                cy="64"
                r="58"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray={364.4} // 2 * PI * r (approx 364.4 for r=58)
                strokeDashoffset={364.4 - (364.4 * score) / 100}
                strokeLinecap="round"
                className={cn("transition-all duration-1000 ease-out", band.color.replace("text-", "stroke-"))}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black">{score}</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">/ 100</span>
            </div>
          </div>
          <p className={cn("text-lg font-black tracking-tight mt-1", band.color)}>
            {band.label}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ScoreItem label="Offensive" value={breakdown.offensiveCoverage} max={35} color="bg-orange-500" />
          <ScoreItem label="Defensive" value={breakdown.defensiveCoverage} max={35} color="bg-blue-500" />
          <ScoreItem label="Balance" value={breakdown.teamBalance} max={20} color="bg-purple-500" />
          <ScoreItem label="Stats" value={breakdown.statDistribution} max={10} color="bg-green-500" />
        </div>
      </CardContent>
    </Card>
  );
}

function ScoreItem({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        <span>{label}</span>
        <span>{value} / {max}</span>
      </div>
      <Progress value={value} max={max} indicatorClassName={color} className="h-1.5" />
    </div>
  );
}
