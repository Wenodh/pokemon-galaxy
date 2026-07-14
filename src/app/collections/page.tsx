import { PageLayout } from "@/components/layout/page-layout";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CollectionsList } from "@/features/collections/components/CollectionsList";
import { LivingDexDashboard } from "@/features/collections/components/LivingDexDashboard";
import { FolderHeart, Sparkles } from "lucide-react";

export const metadata = {
  title: "Collections & Living Dex | Pokémon Galaxy",
  description: "Organize custom permanent collections of Pokémon and track National Pokédex progression.",
};

export default function CollectionsPage() {
  return (
    <PageLayout>
      <Container>
        <div className="py-6 space-y-6">
          <PageHeader
            title="Collections & Living Dex"
            description="Manage your custom groups of Pokémon or track independent Living Pokédex completion progress."
          />

          <Tabs defaultValue="collections" className="w-full space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="collections" className="gap-2">
                <FolderHeart className="h-4 w-4" />
                Custom Collections
              </TabsTrigger>
              <TabsTrigger value="living-dex" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Living Pokédex
              </TabsTrigger>
            </TabsList>

            <TabsContent value="collections" className="focus-visible:outline-none focus-visible:ring-0">
              <CollectionsList />
            </TabsContent>

            <TabsContent value="living-dex" className="focus-visible:outline-none focus-visible:ring-0">
              <LivingDexDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </PageLayout>
  );
}
