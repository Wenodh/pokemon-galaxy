import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PokemonRepository } from "@/features/pokemon/services/pokemon-repository";
import { PokemonHero, PokemonStats, PokemonAbilities, EvolutionChain, TypeEffectiveness, MoveList, RelatedPokemon } from "@/features/pokemon";
import { PokemonViewTracker } from "@/features/recently-viewed/components/pokemon-view-tracker";
import { Container } from "@/components/common/container";

interface PokemonPageProps { params: Promise<{ name: string }>; }

export async function generateMetadata({ params }: PokemonPageProps): Promise<Metadata> {
  const { name } = await params;
  const pokemon = await PokemonRepository.getPokemonDetails(name);
  if (!pokemon) return { title: "Pokémon Not Found | Pokémon Galaxy" };
  const capName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  return { title: capName + " | Pokémon Galaxy", description: pokemon.flavorText, openGraph: { title: capName, images: [{ url: pokemon.image }] } };
}

export default async function PokemonPage({ params }: PokemonPageProps) {
  const { name } = await params;
  const pokemon = await PokemonRepository.getPokemonDetails(name);
  if (!pokemon) {
    notFound();
  }
  const [evolutionChain, relatedPokemon] = await Promise.all([
    PokemonRepository.getEvolutionChain(pokemon.evolutionChainId),
    PokemonRepository.getRelatedPokemon(pokemon.typeIds, pokemon.id),
  ]);
  return (
    <div className="min-h-screen pb-20">
      <PokemonViewTracker pokemonId={pokemon.id} />
      <PokemonHero name={pokemon.name} id={pokemon.id} image={pokemon.image} types={pokemon.types} genus={pokemon.genus} generation={pokemon.generation} height={pokemon.height} weight={pokemon.weight} />
      <Container>
        <div className="mt-8 flex flex-col gap-8 lg:mt-12">
          <section className="mx-auto max-w-3xl text-center"><p className="text-lg font-medium italic leading-relaxed text-muted-foreground md:text-xl">&quot;{pokemon.flavorText}&quot;</p></section>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <PokemonStats stats={pokemon.stats} /><PokemonAbilities abilities={pokemon.abilities} />
          </div>
          {evolutionChain && <EvolutionChain chain={evolutionChain} />}
          <TypeEffectiveness types={pokemon.types} /><MoveList moves={pokemon.moves} /><RelatedPokemon pokemon={relatedPokemon} />
        </div>
      </Container>
    </div>
  );
}
