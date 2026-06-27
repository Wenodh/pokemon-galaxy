import { Card } from "@/components/ui/card";
import { StatBar } from "./stat-bar";
interface PokemonStatsProps { stats: { name: string; value: number; }[]; }
export function PokemonStats({ stats }: PokemonStatsProps) {
  const totalBaseStat = stats.reduce((acc, stat) => acc + stat.value, 0);
  return (
    <Card className="h-full border-border/50 bg-card/50 p-6 backdrop-blur-sm md:p-8">
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="text-2xl font-black tracking-tight">Base Stats</h2>
        <div className="text-sm font-bold text-muted-foreground">Total: <span className="font-mono text-foreground">{totalBaseStat}</span></div>
      </div>
      <div className="space-y-5">
        {stats.map((stat) => ( <StatBar key={stat.name} label={stat.name} value={stat.value} /> ))}
      </div>
      <p className="mt-8 text-[10px] uppercase tracking-widest text-muted-foreground/50">Stats based on generation IX standards</p>
    </Card>
  );
}
