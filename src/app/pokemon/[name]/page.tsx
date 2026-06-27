'use client';

import { useParams } from 'next/navigation';
import { usePokemonDetails } from '@/hooks/use-pokemon';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ChevronRight, Zap, Shield, Heart, Activity, Swords, LucideIcon, Bookmark, Star } from 'lucide-react';
import { useTeamStore } from '@/store/use-team-store';
import { Button } from '@/components/ui/button';
import { PokemonData, PokemonV2PokemonType, PokemonV2PokemonStat, PokemonV2EvolutionChainSpecies, PokemonV2PokemonAbility, PokemonV2PokemonMove } from '@/types/pokemon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/lib/api/db';
import { useLiveQuery } from 'dexie-react-hooks';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const statIcons: Record<string, LucideIcon> = {
  hp: Heart,
  attack: Swords,
  defense: Shield,
  'special-attack': Zap,
  'special-defense': Shield,
  speed: Activity,
};

export default function PokemonDetailPage() {
  const params = useParams();
  const name = params?.name as string;
  const { data, isLoading } = usePokemonDetails(name);
  const addToTeam = useTeamStore((state) => state.addToTeam);

  const castedData = data as PokemonData | undefined;
  const pokemon = castedData?.pokemon?.[0];

  const collectionItem = useLiveQuery(
    () => (pokemon ? db.collection.get(pokemon.id) : undefined),
    [pokemon]
  );

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500" />
    </div>
  );

  if (!pokemon) return <div>Pokémon not found</div>;

  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  const toggleStatus = async (status: 'owned' | 'favorite' | 'seen' | 'want') => {
    if (collectionItem?.status === status) {
      await db.collection.delete(pokemon.id);
    } else {
      await db.collection.put({
        id: pokemon.id,
        name: pokemon.name,
        status,
        addedAt: Date.now(),
      });
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="sticky top-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square flex items-center justify-center bg-white/5 rounded-3xl border border-white/10 backdrop-blur-3xl overflow-hidden mb-8"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-purple-500/20" />
            <Image
              src={imageUrl}
              alt={pokemon.name}
              width={500}
              height={500}
              className="z-10 drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]"
            />
          </motion.div>

          <div className="space-y-6">
            <div className="flex justify-between items-start">
               <div>
                  <h1 className="text-6xl font-black capitalize mb-2 tracking-tighter">{pokemon.name}</h1>
                  <div className="flex gap-3">
                    {pokemon.pokemon_v2_pokemontypes.map((t: PokemonV2PokemonType) => (
                      <span key={t.pokemon_v2_type.name} className="px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-sm font-bold tracking-widest uppercase">
                        {t.pokemon_v2_type.name}
                      </span>
                    ))}
                  </div>
               </div>
               <div className="flex flex-col gap-2">
                 <Button
                    variant="glass"
                    size="lg"
                    className="rounded-2xl"
                    onClick={() => addToTeam({ id: pokemon.id, name: pokemon.name, types: pokemon.pokemon_v2_pokemontypes.map((t: PokemonV2PokemonType) => t.pokemon_v2_type.name) })}
                 >
                    Add to Team
                 </Button>
                 <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn("w-10 h-10 rounded-xl", collectionItem?.status === 'favorite' ? "bg-pink-500/20 text-pink-500" : "bg-white/5")}
                      onClick={() => toggleStatus('favorite')}
                    >
                      <Star className={cn("w-5 h-5", collectionItem?.status === 'favorite' && "fill-current")} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn("w-10 h-10 rounded-xl", collectionItem?.status === 'owned' ? "bg-green-500/20 text-green-500" : "bg-white/5")}
                      onClick={() => toggleStatus('owned')}
                    >
                      <Bookmark className={cn("w-5 h-5", collectionItem?.status === 'owned' && "fill-current")} />
                    </Button>
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] block mb-1">Height</span>
                <span className="text-xl font-bold">{pokemon.height / 10} m</span>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] block mb-1">Weight</span>
                <span className="text-xl font-bold">{pokemon.weight / 10} kg</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="bg-white/5 p-1 rounded-2xl border border-white/10 mb-8 overflow-x-auto h-auto">
              <TabsTrigger value="stats" className="rounded-xl px-6 data-[state=active]:bg-white/10">Stats</TabsTrigger>
              <TabsTrigger value="info" className="rounded-xl px-6 data-[state=active]:bg-white/10">Info</TabsTrigger>
              <TabsTrigger value="moves" className="rounded-xl px-6 data-[state=active]:bg-white/10">Moves</TabsTrigger>
              <TabsTrigger value="evolution" className="rounded-xl px-6 data-[state=active]:bg-white/10">Evolution</TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="space-y-8">
              <section>
                <div className="space-y-6">
                  {pokemon.pokemon_v2_pokemonstats.map((stat: PokemonV2PokemonStat) => {
                    const Icon = statIcons[stat.pokemon_v2_stat.name] || Activity;
                    const percentage = (stat.base_stat / 255) * 100;
                    return (
                      <div key={stat.pokemon_v2_stat.name} className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize flex items-center gap-2 text-white/60 font-bold uppercase tracking-widest text-[10px]">
                            <Icon className="w-4 h-4" /> {stat.pokemon_v2_stat.name.replace('-', ' ')}
                          </span>
                          <span className="font-black">{stat.base_stat}</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </TabsContent>

            <TabsContent value="info" className="space-y-8">
              <section className="space-y-4">
                <h2 className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">Abilities</h2>
                <div className="grid grid-cols-1 gap-4">
                  {pokemon.pokemon_v2_pokemonabilities.map((a: PokemonV2PokemonAbility) => (
                    <Card key={a.pokemon_v2_ability.name} className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                           <span className="font-bold capitalize text-blue-400">{a.pokemon_v2_ability.name}</span>
                           {a.is_hidden && (
                             <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400 text-[10px] font-black uppercase">Hidden</span>
                           )}
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed">
                          {a.pokemon_v2_ability.pokemon_v2_abilityeffecttexts?.[0]?.short_effect || 'No description available.'}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">Description</h2>
                <Card className="bg-white/5 border-white/10 rounded-3xl overflow-hidden">
                  <CardContent className="p-8">
                    <p className="text-lg leading-relaxed text-white/80 italic font-medium">
                      &quot;{pokemon.pokemon_v2_pokemonspecy.pokemon_v2_pokemonspeciesflavortexts[0]?.flavor_text.replace(/\f/g, ' ')}&quot;
                    </p>
                  </CardContent>
                </Card>
              </section>
            </TabsContent>

            <TabsContent value="moves" className="space-y-8">
               <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-white/40 font-black uppercase text-[10px] tracking-widest">Level</TableHead>
                        <TableHead className="text-white/40 font-black uppercase text-[10px] tracking-widest">Move</TableHead>
                        <TableHead className="text-white/40 font-black uppercase text-[10px] tracking-widest">Type</TableHead>
                        <TableHead className="text-white/40 font-black uppercase text-[10px] tracking-widest text-right">Power</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pokemon.pokemon_v2_pokemonmoves.slice(0, 50).map((m: PokemonV2PokemonMove, i: number) => (
                        <TableRow key={`${m.pokemon_v2_move.name}-${i}`} className="border-white/5 hover:bg-white/5">
                          <TableCell className="font-mono text-white/40">{m.level === 0 ? '—' : m.level}</TableCell>
                          <TableCell className="font-bold capitalize">{m.pokemon_v2_move.name.replace('-', ' ')}</TableCell>
                          <TableCell>
                             <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-tighter">
                                {m.pokemon_v2_move.pokemon_v2_type.name}
                             </span>
                          </TableCell>
                          <TableCell className="text-right font-bold">{m.pokemon_v2_move.power || '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
               </Card>
            </TabsContent>

            <TabsContent value="evolution" className="space-y-8">
              <div className="flex flex-wrap items-center gap-4">
                {pokemon.pokemon_v2_pokemonspecy.pokemon_v2_evolutionchain.pokemon_v2_pokemonspecies.map((specie: PokemonV2EvolutionChainSpecies, idx: number, arr: PokemonV2EvolutionChainSpecies[]) => (
                  <div key={specie.id} className="flex items-center gap-4">
                    <Link href={`/pokemon/${specie.name}`}>
                      <Card className={cn(
                        "rounded-2xl transition-all hover:scale-105",
                        specie.name === pokemon.name ? "border-blue-500/50 bg-blue-500/10" : "bg-white/5 border-white/10"
                      )}>
                        <CardContent className="p-4 flex flex-col items-center min-w-[120px]">
                          <Image
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${specie.id}.png`}
                            alt={specie.name}
                            width={80}
                            height={80}
                            className={specie.name === pokemon.name ? "" : "opacity-40 grayscale"}
                          />
                          <span className="text-[10px] font-black capitalize mt-2 tracking-widest">{specie.name}</span>
                        </CardContent>
                      </Card>
                    </Link>
                    {idx < arr.length - 1 && <ChevronRight className="text-white/20" />}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
