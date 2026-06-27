import { useQuery } from '@tanstack/react-query';
import { getPokemonList, getPokemonDetails } from '@/lib/api/pokemon';

export const usePokemonList = (limit?: number, offset?: number) => {
  return useQuery({
    queryKey: ['pokemonList', limit, offset],
    queryFn: () => getPokemonList(limit, offset),
  });
};

export const usePokemonDetails = (name: string) => {
  return useQuery({
    queryKey: ['pokemonDetails', name],
    queryFn: () => getPokemonDetails(name),
    enabled: !!name,
  });
};
