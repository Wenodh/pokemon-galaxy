import { PageLayout } from "@/components/layout/page-layout";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Clock } from "lucide-react";

export default function BattlePage() {
  return (
    <PageLayout>
      <Container>
        <PageHeader
          title="Battle Analyzer"
          description="Analyze matchups and predict battle outcomes."
        />
        <EmptyState
          title="Coming Soon"
          description="The Battle Analyzer will be available in future phases."
          icon={<Clock className="h-6 w-6 text-muted-foreground" />}
        />
      </Container>
    </PageLayout>
  );
}
