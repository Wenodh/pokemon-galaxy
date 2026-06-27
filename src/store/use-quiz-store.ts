import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuizState {
  score: number;
  highScore: number;
  incrementScore: () => void;
  resetScore: () => void;
  setHighScore: (score: number) => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      score: 0,
      highScore: 0,
      incrementScore: () => set((state) => {
        const newScore = state.score + 1;
        return {
          score: newScore,
          highScore: Math.max(state.highScore, newScore)
        };
      }),
      resetScore: () => set({ score: 0 }),
      setHighScore: (score) =>
        set((state) => ({ highScore: Math.max(state.highScore, score) })),
    }),
    {
      name: 'quiz-storage',
    }
  )
);
