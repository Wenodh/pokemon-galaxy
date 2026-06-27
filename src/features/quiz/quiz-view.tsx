'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePokemonList } from '@/hooks/use-pokemon';
import { Button } from '@/components/ui/button';
import { useQuizStore } from '@/store/use-quiz-store';
import Image from 'next/image';
import { PokemonListData } from '@/types/pokemon';

type QuizPokemon = PokemonListData['pokemon'][number];

export default function QuizView() {
  const { score, incrementScore, resetScore } = useQuizStore();
  const [currentPokemon, setCurrentPokemon] = useState<QuizPokemon | null>(null);
  const [options, setOptions] = useState<QuizPokemon[]>([]);
  const [revealed, setRevealed] = useState(false);
  const { data } = usePokemonList(1000);

  const generateQuestion = useCallback(() => {
    const castedData = data as PokemonListData | undefined;
    if (!castedData?.pokemon) return;
    const correct = castedData.pokemon[Math.floor(Math.random() * castedData.pokemon.length)];
    const others = [...castedData.pokemon]
      .filter(p => p.id !== correct.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    setCurrentPokemon(correct);
    setOptions([correct, ...others].sort(() => 0.5 - Math.random()));
    setRevealed(false);
  }, [data]);

  useEffect(() => {
    const castedData = data as PokemonListData | undefined;
    if (castedData?.pokemon && !currentPokemon) generateQuestion();
  }, [data, currentPokemon, generateQuestion]);

  const handleAnswer = (pokemon: QuizPokemon) => {
    if (revealed || !currentPokemon) return;
    if (pokemon.id === currentPokemon.id) {
      incrementScore();
    } else {
      resetScore();
    }
    setRevealed(true);
    setTimeout(generateQuestion, 2000);
  };

  if (!currentPokemon) return null;

  return (
    <div className="p-8 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[80vh]">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black tracking-tighter mb-2">WHO&apos;S THAT POKÉMON?</h1>
        <div className="flex items-center justify-center gap-4">
           <span className="px-4 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-bold uppercase tracking-widest">Streak: {score}</span>
        </div>
      </div>

      <div className="relative aspect-square w-64 md:w-80 mb-12 flex items-center justify-center bg-white/5 rounded-full border border-white/10 backdrop-blur-3xl p-12">
        <Image
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${currentPokemon.id}.png`}
          alt="Mystery"
          width={400}
          height={400}
          className={`transition-all duration-700 ${revealed ? 'brightness-100 drop-shadow-2xl' : 'brightness-0 contrast-100'}`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {options.map((opt) => (
          <Button
            key={opt.id}
            variant="glass"
            className={`h-16 text-lg capitalize font-bold rounded-2xl border-white/10 transition-all ${revealed && opt.id === currentPokemon.id ? 'bg-green-500/20 border-green-500/50 text-green-400' : ''}`}
            onClick={() => handleAnswer(opt)}
            disabled={revealed}
          >
            {opt.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
