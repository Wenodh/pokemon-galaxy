'use client';

import { useTeamStore } from '@/store/use-team-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, ShieldAlert, ShieldCheck, Zap } from 'lucide-react';
import Image from 'next/image';

const TYPE_CHART: Record<string, { strengths: string[], weaknesses: string[] }> = {
  normal: { strengths: [], weaknesses: ['fighting'] },
  fire: { strengths: ['grass', 'ice', 'bug', 'steel'], weaknesses: ['water', 'ground', 'rock'] },
  water: { strengths: ['fire', 'ground', 'rock'], weaknesses: ['electric', 'grass'] },
  grass: { strengths: ['water', 'ground', 'rock'], weaknesses: ['fire', 'ice', 'poison', 'flying', 'bug'] },
  electric: { strengths: ['water', 'flying'], weaknesses: ['ground'] },
  ice: { strengths: ['grass', 'ground', 'flying', 'dragon'], weaknesses: ['fire', 'fighting', 'rock', 'steel'] },
  fighting: { strengths: ['normal', 'ice', 'rock', 'dark', 'steel'], weaknesses: ['flying', 'psychic', 'fairy'] },
  poison: { strengths: ['grass', 'fairy'], weaknesses: ['ground', 'psychic'] },
  ground: { strengths: ['fire', 'electric', 'poison', 'rock', 'steel'], weaknesses: ['water', 'grass', 'ice'] },
  flying: { strengths: ['grass', 'fighting', 'bug'], weaknesses: ['electric', 'rock', 'ice'] },
  psychic: { strengths: ['fighting', 'poison'], weaknesses: ['bug', 'ghost', 'dark'] },
  bug: { strengths: ['grass', 'psychic', 'dark'], weaknesses: ['fire', 'flying', 'rock'] },
  rock: { strengths: ['fire', 'ice', 'flying', 'bug'], weaknesses: ['water', 'grass', 'fighting', 'ground', 'steel'] },
  ghost: { strengths: ['psychic', 'ghost'], weaknesses: ['ghost', 'dark'] },
  dragon: { strengths: ['dragon'], weaknesses: ['ice', 'dragon', 'fairy'] },
  dark: { strengths: ['psychic', 'ghost'], weaknesses: ['fighting', 'bug', 'fairy'] },
  steel: { strengths: ['ice', 'rock', 'fairy'], weaknesses: ['fire', 'fighting', 'ground'] },
  fairy: { strengths: ['fighting', 'dragon', 'dark'], weaknesses: ['poison', 'steel'] },
};

export default function TeamBuilderView() {
  const { currentTeam, removeFromTeam, clearTeam } = useTeamStore();

  const teamAnalysis = () => {
    const weaknesses: Record<string, number> = {};
    const strengths: Record<string, number> = {};

    currentTeam.forEach(p => {
      p.types.forEach(type => {
        TYPE_CHART[type]?.weaknesses.forEach(w => weaknesses[w] = (weaknesses[w] || 0) + 1);
        TYPE_CHART[type]?.strengths.forEach(s => strengths[s] = (strengths[s] || 0) + 1);
      });
    });

    return { weaknesses, strengths };
  };

  const { weaknesses, strengths } = teamAnalysis();

  const score = Math.max(0, 100 - (Object.keys(weaknesses).length * 5) + (Object.keys(strengths).length * 3));

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-2">SQUAD FORMATION</h1>
          <p className="text-white/40 uppercase tracking-widest text-xs font-bold">Strategic Team Analysis and Optimization</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end mr-4">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Team Score</span>
              <span className="text-3xl font-black text-blue-500">{currentTeam.length > 0 ? score : '--'}</span>
           </div>
           <Button variant="destructive" className="rounded-2xl px-6 font-bold" onClick={clearTeam} disabled={currentTeam.length === 0}>
             Reset Formation
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => {
            const p = currentTeam[i];
            return (
              <Card key={i} className={`h-64 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500 ${!p ? 'border-dashed border-white/10 bg-black/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                {p ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-500/10" />
                    <div className="relative group">
                       <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity" />
                       <Image
                         src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`}
                         alt={p.name}
                         width={120}
                         height={120}
                         className="relative z-10 drop-shadow-2xl"
                       />
                    </div>
                    <span className="font-black capitalize mt-4 text-xl tracking-tight">{p.name}</span>
                    <div className="flex gap-1 mt-2">
                       {p.types.map(t => (
                         <span key={t} className="px-2 py-0.5 rounded bg-white/10 text-[9px] font-black uppercase tracking-widest">{t}</span>
                       ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 text-white/20 hover:text-red-500 hover:bg-red-500/20 rounded-full"
                      onClick={() => removeFromTeam(p.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4 opacity-20">
                     <Zap className="w-8 h-8" />
                     <span className="font-black text-2xl">0{i + 1}</span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <div className="space-y-6">
          <Card className="border-white/10 bg-white/5 rounded-3xl overflow-hidden">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 text-green-400">
                <ShieldCheck className="w-4 h-4" /> Coverage Strengths
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {Object.entries(strengths).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                  <span key={type} className="px-3 py-1.5 bg-green-500/10 text-green-400 text-[10px] font-black rounded-xl border border-green-500/20 uppercase tracking-tighter">
                    {type} <span className="ml-1 opacity-40">x{count}</span>
                  </span>
                ))}
                {Object.keys(strengths).length === 0 && <span className="text-white/20 text-xs font-bold uppercase tracking-widest">No strengths detected</span>}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 rounded-3xl overflow-hidden">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 text-red-400">
                <ShieldAlert className="w-4 h-4" /> Team Weaknesses
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {Object.entries(weaknesses).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                  <span key={type} className="px-3 py-1.5 bg-red-500/10 text-red-400 text-[10px] font-black rounded-xl border border-red-500/20 uppercase tracking-tighter">
                    {type} <span className="ml-1 opacity-40">x{count}</span>
                  </span>
                ))}
                {Object.keys(weaknesses).length === 0 && <span className="text-white/20 text-xs font-bold uppercase tracking-widest">No weaknesses detected</span>}
              </div>
            </CardContent>
          </Card>

          <div className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-3xl">
             <h3 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-2">Tactical Advice</h3>
             <p className="text-sm text-white/60 leading-relaxed font-medium">
                {currentTeam.length < 6 ?
                  `Add ${6 - currentTeam.length} more species to your formation for a complete strategic analysis.` :
                  score > 80 ? "Your current squad formation is exceptionally balanced and ready for high-level encounters." :
                  "Consider swapping one species to mitigate your team's cumulative type weaknesses."}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
