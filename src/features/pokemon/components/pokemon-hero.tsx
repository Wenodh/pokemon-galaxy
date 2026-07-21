"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/common/container";
import { cn } from "@/lib/utils";
import { FavoriteButton } from "@/features/favorites/components/FavoriteButton";
import { typeColors } from "../utils/type-colors";
interface PokemonHeroProps { name: string; id: number; image: string; types: string[]; genus: string; generation: string; height: number; weight: number; }
export function PokemonHero({ name, id, image, types, genus, generation, height, weight, }: PokemonHeroProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background py-12 lg:py-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.1),transparent_50%)]" />
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-8 lg:flex-row lg:items-end lg:gap-16"
        >
          <div className="relative aspect-square w-full max-w-[320px] lg:max-w-[480px]">
            <div className="absolute inset-0 animate-pulse rounded-full bg-primary/5 blur-3xl" />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative h-full w-full"
            >
              <Image src={image} alt={name} fill priority className="object-contain" sizes="(max-width: 768px) 320px, 480px" />
            </motion.div>
          </div>
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-2 font-mono text-xs font-bold tracking-widest text-primary sm:text-sm md:text-lg">
              #{id.toString().padStart(3, "0")} — {generation.replace("generation-", "GEN ")}
            </div>
            <div className="mb-4 flex items-center justify-center gap-4 lg:justify-start">
              <h1 className="text-4xl font-black capitalize tracking-tighter sm:text-5xl md:text-7xl lg:text-8xl">{name}</h1>
              <FavoriteButton
                pokemonId={id}
                pokemonName={name}
                size="md"
                variant="filled"
                className="mt-1 shrink-0"
              />
            </div>
            <div className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-3 lg:justify-start">
              {types.map((type) => (
                <Badge key={type} className={cn("rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest shadow-lg sm:px-6 sm:py-1.5 sm:text-sm", typeColors[type.toLowerCase()] || "bg-slate-500 text-white")}>{type}</Badge>
              ))}
              <Badge variant="outline" className="rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-widest sm:px-6 sm:py-1.5 sm:text-sm">{genus}</Badge>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="grid grid-cols-2 gap-4 rounded-2xl border border-border/50 bg-card/30 p-4 backdrop-blur-md sm:rounded-3xl sm:p-6 md:flex md:gap-12 md:p-8"
            >
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:text-xs">Height</span>
                <span className="text-xl font-black sm:text-2xl">{(height / 10).toFixed(1)}m</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:text-xs">Weight</span>
                <span className="text-xl font-black sm:text-2xl">{(weight / 10).toFixed(1)}kg</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
