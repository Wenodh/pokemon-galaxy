'use client';

import { useState, useMemo } from 'react';
import { usePokemonList } from '@/hooks/use-pokemon';
import { PokemonCard } from '@/components/pokemon/pokemon-card';
import { Input } from '@/components/ui/input';
import { Search, LayoutGrid, List, Filter, X } from 'lucide-react';
import { PokemonListData } from '@/types/pokemon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison',
  'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

const GENERATIONS = [
  { label: 'Gen 1', value: 'generation-i' },
  { label: 'Gen 2', value: 'generation-ii' },
  { label: 'Gen 3', value: 'generation-iii' },
  { label: 'Gen 4', value: 'generation-iv' },
  { label: 'Gen 5', value: 'generation-v' },
  { label: 'Gen 6', value: 'generation-vi' },
  { label: 'Gen 7', value: 'generation-vii' },
  { label: 'Gen 8', value: 'generation-viii' },
  { label: 'Gen 9', value: 'generation-ix' },
];

export default function PokedexView() {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedGen, setSelectedGen] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = usePokemonList(1000);

  const castedData = data as PokemonListData | undefined;

  const filteredPokemon = useMemo(() => {
    return castedData?.pokemon?.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toString() === search;
      const matchesType = selectedType === 'all' || p.pokemon_v2_pokemontypes.some(t => t.pokemon_v2_type.name === selectedType);
      const matchesGen = selectedGen === 'all' || p.pokemon_v2_pokemonspecy.pokemon_v2_generation.name === selectedGen;
      return matchesSearch && matchesType && matchesGen;
    });
  }, [castedData, search, selectedType, selectedGen]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight">POKÉDEX</h1>
          <p className="text-white/40">Access the universal database of all known species</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search by name or number..."
              className="pl-10 bg-white/5 border-white/10 focus:ring-blue-500/50 rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
            <Button
              variant="ghost"
              size="icon"
              className={cn("w-10 h-10 rounded-lg", viewMode === 'grid' && "bg-white/10")}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("w-10 h-10 rounded-lg", viewMode === 'list' && "bg-white/10")}
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="glass"
            className={cn("rounded-xl border-white/10", showFilters && "bg-white/10")}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-wrap gap-6 items-end animate-in fade-in slide-in-from-top-4 duration-300">
           <div className="space-y-2">
             <label className="text-xs font-bold uppercase tracking-widest text-white/40">Type</label>
             <Select value={selectedType} onValueChange={(val) => setSelectedType(val ?? 'all')}>
               <SelectTrigger className="w-[180px] bg-black/20 border-white/10 rounded-xl capitalize">
                 <SelectValue placeholder="All Types" />
               </SelectTrigger>
               <SelectContent className="bg-zinc-900 border-white/10 rounded-xl">
                 <SelectItem value="all">All Types</SelectItem>
                 {POKEMON_TYPES.map(type => (
                   <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>

           <div className="space-y-2">
             <label className="text-xs font-bold uppercase tracking-widest text-white/40">Generation</label>
             <Select value={selectedGen} onValueChange={(val) => setSelectedGen(val ?? 'all')}>
               <SelectTrigger className="w-[180px] bg-black/20 border-white/10 rounded-xl">
                 <SelectValue placeholder="All Generations" />
               </SelectTrigger>
               <SelectContent className="bg-zinc-900 border-white/10 rounded-xl">
                 <SelectItem value="all">All Generations</SelectItem>
                 {GENERATIONS.map(gen => (
                   <SelectItem key={gen.value} value={gen.value}>{gen.label}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>

           <Button
            variant="ghost"
            className="text-white/40 hover:text-white mb-0.5"
            onClick={() => {
              setSelectedType('all');
              setSelectedGen('all');
              setSearch('');
            }}
           >
             <X className="w-4 h-4 mr-2" /> Reset
           </Button>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredPokemon?.map((p) => (
                <PokemonCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  types={p.pokemon_v2_pokemontypes.map((t) => t.pokemon_v2_type.name)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
               {filteredPokemon?.map((p) => (
                 <Link key={p.id} href={`/pokemon/${p.name}`}>
                  <div className="group flex items-center gap-6 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                    <span className="text-2xl font-black text-white/10 min-w-[60px]">#{p.id.toString().padStart(3, '0')}</span>
                    <Image
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`}
                      alt={p.name}
                      width={60}
                      height={60}
                      className="drop-shadow-lg group-hover:scale-110 transition-transform"
                    />
                    <span className="text-xl font-bold capitalize flex-1">{p.name}</span>
                    <div className="flex gap-2">
                      {p.pokemon_v2_pokemontypes.map(t => (
                        <span key={t.pokemon_v2_type.name} className="px-3 py-1 bg-white/10 rounded-lg text-xs font-bold uppercase tracking-widest border border-white/10">
                          {t.pokemon_v2_type.name}
                        </span>
                      ))}
                    </div>
                  </div>
                 </Link>
               ))}
            </div>
          )}

          {filteredPokemon?.length === 0 && (
            <div className="text-center py-24">
              <p className="text-white/40 text-xl">No species found matching your filters</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
