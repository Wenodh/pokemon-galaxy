import { PokemonCard } from "@/features/pokedex/components/pokemon-card";
import { PokemonListItem } from "../types";
interface RelatedPokemonProps { pokemon: PokemonListItem[]; }
export function RelatedPokemon({ pokemon }: RelatedPokemonProps) {
  if (pokemon.length === 0) return null;
  return (
    <section>
      <h2 className="mb-8 text-3xl font-black tracking-tight text-center lg:text-left">Explore More</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {pokemon.map((p) => ( <PokemonCard key={p.id} pokemon={p} density="comfortable" /> ))}
      </div>
    </section>
  );
}
