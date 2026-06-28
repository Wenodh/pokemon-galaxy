import { Suspense } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { FavoritesPageContent } from "@/features/favorites/components/favorites-page-content";
import { PokemonSkeletonGrid } from "@/features/pokedex/components/pokemon-skeleton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favorites | Pokemon Galaxy",
  description: "Your personal collection of favorite Pokémon.",
};

export default function FavoritesPage() {
  return (
    <PageLayout>
      <Suspense fallback={<PokemonSkeletonGrid count={8} />}>
        <FavoritesPageContent />
      </Suspense>
    </PageLayout>
  );
}
