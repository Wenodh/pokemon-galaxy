import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { calculateTypeEffectiveness } from "../utils/type-effectiveness";
import { typeColors } from "../utils/type-colors";

interface TypeEffectivenessProps { types: string[]; }

export function TypeEffectiveness({ types }: TypeEffectivenessProps) {
  const effectiveness = calculateTypeEffectiveness(types);
  return (
    <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm md:p-8">
      <h2 className="mb-6 text-2xl font-black tracking-tight">Type Matchups</h2>
      <div className="grid gap-8 md:grid-cols-3">
        <section>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-red-500 dark:text-red-400">Weak Against</h3>
          <div className="flex flex-wrap gap-2">{effectiveness.weaknesses.map((w) => ( <div key={w.type} className="flex flex-col items-center"><Badge className={cn("rounded-md px-3 py-1 text-[10px] font-black uppercase tracking-wider", typeColors[w.type.toLowerCase()] || "bg-slate-500 text-white")}>{w.type}</Badge><span className="mt-1 font-mono text-[10px] font-bold text-muted-foreground">{w.multiplier}x</span></div> ))}{effectiveness.weaknesses.length === 0 && ( <p className="text-sm text-muted-foreground italic">None</p> )}</div>
        </section>
        <section>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Resistant To</h3>
          <div className="flex flex-wrap gap-2">{effectiveness.resistances.map((r) => ( <div key={r.type} className="flex flex-col items-center"><Badge className={cn("rounded-md px-3 py-1 text-[10px] font-black uppercase tracking-wider", typeColors[r.type.toLowerCase()] || "bg-slate-500 text-white")}>{r.type}</Badge><span className="mt-1 font-mono text-[10px] font-bold text-muted-foreground">{r.multiplier}x</span></div> ))}{effectiveness.resistances.length === 0 && ( <p className="text-sm text-muted-foreground italic">None</p> )}</div>
        </section>
        <section>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">Immune To</h3>
          <div className="flex flex-wrap gap-2">{effectiveness.immunities.map((i) => ( <div key={i.type} className="flex flex-col items-center"><Badge className={cn("rounded-md px-3 py-1 text-[10px] font-black uppercase tracking-wider", typeColors[i.type.toLowerCase()] || "bg-slate-500 text-white")}>{i.type}</Badge><span className="mt-1 font-mono text-[10px] font-bold text-muted-foreground">0x</span></div> ))}{effectiveness.immunities.length === 0 && ( <p className="text-sm text-muted-foreground italic">None</p> )}</div>
        </section>
      </div>
    </Card>
  );
}
