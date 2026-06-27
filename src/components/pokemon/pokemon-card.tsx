'use client';

import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface PokemonCardProps {
  id: number;
  name: string;
  types: string[];
}

export function PokemonCard({ id, name, types }: PokemonCardProps) {
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Link href={`/pokemon/${name}`}>
        <Card className="overflow-hidden group cursor-pointer border-white/5 hover:border-white/20 transition-all duration-300">
          <CardContent className="p-0">
            <div className="aspect-square relative flex items-center justify-center p-6 bg-gradient-to-b from-white/5 to-transparent">
              <Image
                src={imageUrl}
                alt={name}
                width={200}
                height={200}
                className="z-10 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all"
              />
              <span className="absolute top-4 left-4 text-xs font-mono text-white/20 group-hover:text-white/40 transition-colors">
                #{String(id).padStart(3, '0')}
              </span>
            </div>
            <div className="p-4 bg-white/5">
              <h3 className="text-lg font-bold capitalize mb-2">{name}</h3>
              <div className="flex gap-2">
                {types.map((type) => (
                  <span
                    key={type}
                    className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/10 border border-white/10"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
