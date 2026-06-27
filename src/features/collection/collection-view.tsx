'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/api/db';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, CheckCircle2, Eye, Bookmark, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const statusIcons = {
  favorite: { icon: Heart, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  owned: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
  seen: { icon: Eye, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  want: { icon: Bookmark, color: 'text-purple-500', bg: 'bg-purple-500/10' },
};

export default function CollectionView() {
  const [filter, setFilter] = useState<string>('all');

  const collection = useLiveQuery(
    () => filter === 'all' ? db.collection.toArray() : db.collection.where('status').equals(filter).toArray(),
    [filter]
  );

  const removeItem = async (id: number) => {
    await db.collection.delete(id);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
           <h1 className="text-4xl font-black tracking-tight mb-2">PERSONAL ARCHIVE</h1>
           <p className="text-white/40 uppercase tracking-widest text-xs font-bold">Synchronized with Local Data Systems</p>
        </div>

        <div className="flex flex-wrap gap-2">
           {['all', 'owned', 'favorite', 'seen', 'want'].map((s) => (
             <Button
               key={s}
               variant="glass"
               size="sm"
               className={cn("rounded-full px-4 capitalize", filter === s && "bg-white/20 border-white/40")}
               onClick={() => setFilter(s)}
             >
               {s}
             </Button>
           ))}
        </div>
      </div>

      {!collection || collection.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
           <Bookmark className="w-16 h-16 text-white/5 mb-6" />
           <p className="text-white/40 font-bold uppercase tracking-widest text-sm">Your collection is currently empty</p>
           <Link href="/pokedex" className="mt-4">
             <Button variant="outline" className="rounded-2xl border-white/10 hover:bg-white/5">Browse Pokédex</Button>
           </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {collection.map((item) => {
            const status = statusIcons[item.status as keyof typeof statusIcons];
            const Icon = status.icon;

            return (
              <Card key={item.id} className="group bg-white/5 border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all">
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="w-full flex justify-between items-center mb-2">
                    <span className={cn("px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter flex items-center gap-1", status.bg, status.color)}>
                       <Icon className="w-3 h-3" /> {item.status}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-500/20"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <Link href={`/pokemon/${item.name}`} className="flex flex-col items-center">
                    <div className="relative w-32 h-32 mb-4">
                       <Image
                         src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.id}.png`}
                         alt={item.name}
                         fill
                         className="object-contain drop-shadow-xl"
                       />
                    </div>
                    <span className="font-bold capitalize text-lg">{item.name}</span>
                    <span className="text-white/20 text-xs font-mono">#{item.id.toString().padStart(3, '0')}</span>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
