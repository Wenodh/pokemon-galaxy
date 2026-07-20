"use client";
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Move } from "../types";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { typeColors } from "../utils/type-colors";
interface MoveListProps { moves: Move[]; }
const categoryColors: Record<string, string> = { physical: "text-red-600 dark:text-red-400", special: "text-blue-600 dark:text-blue-400", status: "text-zinc-600 dark:text-zinc-400", };
export function MoveList({ moves }: MoveListProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const filteredMoves = useMemo(() => { return moves.filter((move) => { const matchesSearch = move.name.toLowerCase().includes(search.toLowerCase()); const matchesType = typeFilter === "all" || move.type === typeFilter; const matchesCategory = categoryFilter === "all" || move.category === categoryFilter; return matchesSearch && matchesType && matchesCategory; }).sort((a, b) => a.name.localeCompare(b.name)); }, [moves, search, typeFilter, categoryFilter]);
  const allTypes = useMemo(() => ["all", ...new Set(moves.map((m) => m.type))], [moves]);
  const allCategories = useMemo(() => ["all", ...new Set(moves.map((m) => m.category))], [moves]);
  return (
    <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm md:p-8">
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-2xl font-black tracking-tight">Moves</h2>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              aria-label="Search moves"
              placeholder="Search moves..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-full border border-border/50 bg-background/50 pl-10 pr-4 text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 md:w-64"
            />
          </div>
          <div className="flex gap-2">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="h-10 rounded-full border border-border/50 bg-background/50 px-4 text-xs font-bold uppercase tracking-wider focus:border-primary/50 focus:outline-none md:w-32">{allTypes.map((t) => ( <option key={t} value={t}>{t.toUpperCase()}</option> ))}</select>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="h-10 rounded-full border border-border/50 bg-background/50 px-4 text-xs font-bold uppercase tracking-wider focus:border-primary/50 focus:outline-none md:w-32">{allCategories.map((c) => ( <option key={c} value={c}>{c.toUpperCase()}</option> ))}</select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <th className="pb-4 pl-4 font-black">Move</th><th className="pb-4 font-black">Type</th><th className="pb-4 font-black">Cat.</th><th className="pb-4 font-black">Pwr.</th><th className="pb-4 font-black">Acc.</th><th className="pb-4 font-black">PP</th><th className="pb-4 font-black">Lvl.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {filteredMoves.map((move) => (
              <tr key={move.name} className="group hover:bg-primary/5 transition-colors">
                <td className="py-4 pl-4 text-sm font-bold capitalize tracking-tight group-hover:text-primary">{move.name.replace("-", " ")}</td>
                <td className="py-4"><Badge className={cn("rounded-sm px-2 py-0.5 text-[10px] font-black uppercase tracking-wider", typeColors[move.type.toLowerCase()] || "bg-slate-500 text-white")}>{move.type}</Badge></td>
                <td className={cn("py-4 text-[10px] font-black uppercase tracking-widest", categoryColors[move.category.toLowerCase()])}>{move.category}</td>
                <td className="py-4 font-mono text-sm">{move.power || "—"}</td>
                <td className="py-4 font-mono text-sm">{move.accuracy ? `${move.accuracy}%` : "—"}</td>
                <td className="py-4 font-mono text-sm">{move.pp || "—"}</td>
                <td className="py-4 font-mono text-sm text-muted-foreground">{move.level || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMoves.length === 0 && ( <div className="py-20 text-center text-muted-foreground">No moves found matching your criteria.</div> )}
      </div>
    </Card>
  );
}
