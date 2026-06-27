'use client';

import { useState } from 'react';
import { usePokemonList, usePokemonDetails } from '@/hooks/use-pokemon';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Swords, Shield, Zap, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { getEffectiveness } from '@/lib/utils/battle';
import { PokemonListData, PokemonV2Pokemon } from '@/types/pokemon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

function PokemonSelector({ onSelect, selectedPokemon }: { onSelect: (name: string) => void, selectedPokemon?: PokemonV2Pokemon }) {
  const [open, setOpen] = useState(false);
  const { data } = usePokemonList(1000);
  const castedData = data as PokemonListData | undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="glass" className="w-full h-32 flex flex-col items-center justify-center gap-2 rounded-3xl border-dashed border-white/20">
          {selectedPokemon ? (
            <>
              <Image
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${selectedPokemon.id}.png`}
                alt={selectedPokemon.name}
                width={60}
                height={60}
              />
              <span className="font-bold capitalize">{selectedPokemon.name}</span>
            </>
          ) : (
            <>
              <Search className="w-6 h-6 text-white/40" />
              <span className="text-white/40 font-bold uppercase tracking-widest text-xs">Select Species</span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-zinc-900 border-white/10" align="start">
        <Command>
          <CommandInput placeholder="Search species..." className="h-9" />
          <CommandList>
            <CommandEmpty>No species found.</CommandEmpty>
            <CommandGroup>
              {castedData?.pokemon.map((p) => (
                <CommandItem
                  key={p.id}
                  value={p.name}
                  onSelect={(currentValue) => {
                    onSelect(currentValue);
                    setOpen(false);
                  }}
                  className="capitalize"
                >
                  {p.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default function BattleAnalyzerView() {
  const [p1Name, setP1Name] = useState<string>('');
  const [p2Name, setP2Name] = useState<string>('');

  const { data: p1Data } = usePokemonDetails(p1Name);
  const { data: p2Data } = usePokemonDetails(p2Name);

  const pokemon1 = p1Data?.pokemon?.[0] as PokemonV2Pokemon | undefined;
  const pokemon2 = p2Data?.pokemon?.[0] as PokemonV2Pokemon | undefined;

  const p1Types = pokemon1?.pokemon_v2_pokemontypes.map(t => t.pokemon_v2_type.name) || [];
  const p2Types = pokemon2?.pokemon_v2_pokemontypes.map(t => t.pokemon_v2_type.name) || [];

  const p1ToP2Effectiveness = getEffectiveness(p1Types, p2Types);
  const p2ToP1Effectiveness = getEffectiveness(p2Types, p1Types);

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 mb-4">
          <Swords className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-[0.2em]">Battle Analyzer</span>
        </div>
        <h1 className="text-5xl font-black tracking-tighter mb-4">TACTICAL SIMULATION</h1>
        <p className="text-white/40 max-w-md mx-auto uppercase tracking-widest text-[10px] font-bold">Compare species to identify type advantages and strategic vulnerabilities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-12">
        <PokemonSelector onSelect={setP1Name} selectedPokemon={pokemon1} />
        <div className="flex flex-col items-center justify-center">
           <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-2xl font-black italic text-white/20">VS</span>
           </div>
        </div>
        <PokemonSelector onSelect={setP2Name} selectedPokemon={pokemon2} />
      </div>

      {pokemon1 && pokemon2 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <Card className="bg-white/5 border-white/10 overflow-hidden rounded-3xl">
              <CardContent className="p-8 space-y-6">
                 <div className="flex justify-between items-center">
                    <h3 className="font-black uppercase tracking-widest text-white/40 text-xs">Offensive Analysis</h3>
                    <TrendingUp className="w-4 h-4 text-white/20" />
                 </div>

                 <div className="space-y-8">
                    <div>
                       <div className="flex justify-between mb-4">
                          <span className="font-bold capitalize">{pokemon1.name} → {pokemon2.name}</span>
                          <span className={cn("font-black px-3 py-1 rounded-lg text-xs", p1ToP2Effectiveness > 1 ? "bg-green-500/20 text-green-400" : p1ToP2Effectiveness < 1 ? "bg-red-500/20 text-red-400" : "bg-white/10")}>
                             {p1ToP2Effectiveness}x Effectiveness
                          </span>
                       </div>
                       <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${Math.min(p1ToP2Effectiveness * 25, 100)}%` }} />
                       </div>
                    </div>

                    <div>
                       <div className="flex justify-between mb-4">
                          <span className="font-bold capitalize">{pokemon2.name} → {pokemon1.name}</span>
                          <span className={cn("font-black px-3 py-1 rounded-lg text-xs", p2ToP1Effectiveness > 1 ? "bg-green-500/20 text-green-400" : p2ToP1Effectiveness < 1 ? "bg-red-500/20 text-red-400" : "bg-white/10")}>
                             {p2ToP1Effectiveness}x Effectiveness
                          </span>
                       </div>
                       <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500" style={{ width: `${Math.min(p2ToP1Effectiveness * 25, 100)}%` }} />
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card className="bg-white/5 border-white/10 overflow-hidden rounded-3xl">
              <CardContent className="p-8 space-y-6">
                 <div className="flex justify-between items-center">
                    <h3 className="font-black uppercase tracking-widest text-white/40 text-xs">Comparison</h3>
                    <Shield className="w-4 h-4 text-white/20" />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    {['HP', 'Attack', 'Defense', 'Speed'].map((stat) => {
                       const statKey = stat.toLowerCase() === 'hp' ? 'hp' : stat.toLowerCase();
                       const s1 = pokemon1.pokemon_v2_pokemonstats.find(s => s.pokemon_v2_stat.name === statKey)?.base_stat || 0;
                       const s2 = pokemon2.pokemon_v2_pokemonstats.find(s => s.pokemon_v2_stat.name === statKey)?.base_stat || 0;
                       return (
                          <div key={stat} className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                             <span className="text-[10px] font-black text-white/20 uppercase tracking-widest block mb-2">{stat}</span>
                             <div className="flex items-end justify-between">
                                <span className={cn("text-xl font-black", s1 > s2 ? "text-blue-400" : "text-white/60")}>{s1}</span>
                                <span className="text-white/10 text-xs font-bold">vs</span>
                                <span className={cn("text-xl font-black", s2 > s1 ? "text-purple-400" : "text-white/60")}>{s2}</span>
                             </div>
                          </div>
                       );
                    })}
                 </div>
              </CardContent>
           </Card>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
           <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Zap className="w-8 h-8 text-white/10" />
           </div>
           <p className="text-white/20 font-bold uppercase tracking-widest text-xs">Awaiting Species Input for Tactical Simulation</p>
        </div>
      )}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
