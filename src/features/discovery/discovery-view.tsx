'use client';

import { usePokemonList } from '@/hooks/use-pokemon';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { PokemonListData, PokemonV2PokemonType } from '@/types/pokemon';

export default function DailyDiscoveryView() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const { data } = usePokemonList(1, (dayOfYear * 13) % 1000);
  const castedData = data as PokemonListData | undefined;
  const pokemon = castedData?.pokemon?.[0];

  if (!pokemon) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[80vh]">
       <div className="flex items-center gap-2 mb-8 text-blue-500">
         <Sparkles className="w-5 h-5" />
         <span className="uppercase tracking-[0.3em] font-bold text-sm">Species of the Day</span>
       </div>

       <Card className="w-full relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-white/20">
          <CardContent className="p-12 flex flex-col md:flex-row items-center gap-12">
            <div className="relative group">
               <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
               <Image
                 src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                 alt={pokemon.name}
                 width={400}
                 height={400}
                 className="relative z-10 drop-shadow-2xl"
               />
            </div>
            <div className="flex-1 space-y-6">
              <h2 className="text-7xl font-black capitalize tracking-tighter">{pokemon.name}</h2>
              <div className="flex gap-4">
                {pokemon.pokemon_v2_pokemontypes.map((t: PokemonV2PokemonType) => (
                  <span key={t.pokemon_v2_type.name} className="px-6 py-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 font-bold uppercase tracking-widest text-sm">
                    {t.pokemon_v2_type.name}
                  </span>
                ))}
              </div>
              <p className="text-white/60 text-lg leading-relaxed">
                A mysterious energy has aligned today with the {pokemon.name} star system.
                Explore its stats and potential in your next battle.
              </p>
              <div className="flex gap-4 pt-4">
                <Link href={`/pokemon/${pokemon.name}`}>
                  <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-2xl px-8">View Species</Button>
                </Link>
                <Button variant="outline" className="rounded-2xl border-white/20 hover:bg-white/5" onClick={() => window.location.reload()}>
                  <RefreshCcw className="w-4 h-4 mr-2" /> Explore Another
                </Button>
              </div>
            </div>
          </CardContent>
       </Card>
    </div>
  );
}
