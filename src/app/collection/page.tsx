import { PageLayout } from "@/components/layout/page-layout";
import { CollectionPageContent } from "@/features/collection/components/collection-page-content";

export const metadata = {
  title: "Collection | Pokemon Galaxy",
  description: "View and manage your personal Pokémon collection.",
};

export default function CollectionPage() {
  return (
    <PageLayout>
      <CollectionPageContent />
    </PageLayout>
  );
}
