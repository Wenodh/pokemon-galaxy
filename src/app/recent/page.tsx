import { Suspense } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { RecentlyViewedPageContent } from "@/features/recently-viewed/components/recently-viewed-page-content";
import { PokemonSkeletonGrid } from "@/features/pokedex/components/pokemon-skeleton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recently Viewed | Pokemon Galaxy",
  description: "Your browsing history across the galaxy.",
};

export default function RecentlyViewedPage() {
  return (
    <PageLayout>
      <Suspense fallback={<PokemonSkeletonGrid count={8} />}>
        <RecentlyViewedPageContent />
      </Suspense>
    </PageLayout>
  );
}
