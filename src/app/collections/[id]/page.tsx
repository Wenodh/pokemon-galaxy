import { PageLayout } from "@/components/layout/page-layout";
import { Container } from "@/components/common/container";
import { CollectionDetails } from "@/features/collections/components/CollectionDetails";

interface CollectionPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Collection Details | Pokémon Galaxy",
  description: "View, sort, filter, and organize Pokémon within this collection.",
};

export default async function CollectionDetailsPage({ params }: CollectionPageProps) {
  const { id } = await params;

  return (
    <PageLayout>
      <Container>
        <div className="py-6">
          <CollectionDetails id={id} />
        </div>
      </Container>
    </PageLayout>
  );
}
