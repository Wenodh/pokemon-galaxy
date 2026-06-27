import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { calculateTypeEffectiveness } from "../utils/type-effectiveness";
interface TypeEffectivenessProps { types: string[]; }
const typeColors: Record<string, string> = { normal: "bg-zinc-400 dark:bg-zinc-500", fire: "bg-orange-500", water: "bg-blue-500", grass: "bg-emerald-500", electric: "bg-yellow-400 text-black", ice: "bg-cyan-300 text-black", fighting: "bg-red-600", poison: "bg-purple-500", ground: "bg-amber-600", flying: "bg-indigo-400", psychic: "bg-pink-500", bug: "bg-lime-500", rock: "bg-stone-500", ghost: "bg-violet-700", dragon: "bg-indigo-600", dark: "bg-zinc-800", steel: "bg-slate-400", fairy: "bg-pink-300 text-black", };
export function TypeEffectiveness({ types }: TypeEffectivenessProps) {
  const effectiveness = calculateTypeEffectiveness(types);
  return (
    <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm md:p-8">
      <h2 className="mb-6 text-2xl font-black tracking-tight">Type Matchups</h2>
      <div className="grid gap-8 md:grid-cols-3">
        <section>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-red-500">Weak Against</h3>
          <div className="flex flex-wrap gap-2">{effectiveness.weaknesses.map((w) => ( <div key={w.type} className="flex flex-col items-center"><Badge className={cn("rounded-md px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white", typeColors[w.type.toLowerCase()] || "bg-slate-500")}>{w.type}</Badge><span className="mt-1 font-mono text-[10px] font-bold text-muted-foreground">{w.multiplier}x</span></div> ))}{effectiveness.weaknesses.length === 0 && ( <p className="text-sm text-muted-foreground italic">None</p> )}</div>
        </section>
        <section>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-emerald-500">Resistant To</h3>
          <div className="flex flex-wrap gap-2">{effectiveness.resistances.map((r) => ( <div key={r.type} className="flex flex-col items-center"><Badge className={cn("rounded-md px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white", typeColors[r.type.toLowerCase()] || "bg-slate-500")}>{r.type}</Badge><span className="mt-1 font-mono text-[10px] font-bold text-muted-foreground">{r.multiplier}x</span></div> ))}{effectiveness.resistances.length === 0 && ( <p className="text-sm text-muted-foreground italic">None</p> )}</div>
        </section>
        <section>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-500">Immune To</h3>
          <div className="flex flex-wrap gap-2">{effectiveness.immunities.map((i) => ( <div key={i.type} className="flex flex-col items-center"><Badge className={cn("rounded-md px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white", typeColors[i.type.toLowerCase()] || "bg-slate-500")}>{i.type}</Badge><span className="mt-1 font-mono text-[10px] font-bold text-muted-foreground">0x</span></div> ))}{effectiveness.immunities.length === 0 && ( <p className="text-sm text-muted-foreground italic">None</p> )}</div>
        </section>
      </div>
    </Card>
  );
}
