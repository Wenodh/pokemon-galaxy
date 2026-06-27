import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
interface PokemonAbilitiesProps { abilities: { name: string; isHidden: boolean; description: string; }[]; }
export function PokemonAbilities({ abilities }: PokemonAbilitiesProps) {
  return (
    <Card className="h-full border-border/50 bg-card/50 p-6 backdrop-blur-sm md:p-8">
      <h2 className="mb-6 text-2xl font-black tracking-tight">Abilities</h2>
      <div className="space-y-6">
        {abilities.map((ability) => (
          <div key={ability.name} className="group flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold capitalize tracking-tight transition-colors group-hover:text-primary">{ability.name.replace("-", " ")}</h3>
              {ability.isHidden && ( <Badge variant="secondary" className="rounded-sm px-1.5 py-0 text-[10px] font-bold uppercase tracking-tighter">Hidden</Badge> )}
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{ability.description || "No description available for this ability."}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
