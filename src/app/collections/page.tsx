import { PageLayout } from "@/components/layout/page-layout";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { CollectionsList } from "@/features/collections/components/CollectionsList";

export const metadata = {
  title: "Custom Collections | Pokémon Galaxy",
  description: "Organize custom permanent collections of Pokémon.",
};

export default function CollectionsPage() {
  return (
    <PageLayout>
      <Container>
        <div className="py-6 space-y-6">
          <PageHeader
            title="Custom Collections"
            description="Manage your custom groups of Pokémon, team members, or childhood favorites."
          />

          <div className="pt-2">
            <CollectionsList />
          </div>
        </div>
      </Container>
    </PageLayout>
  );
}
