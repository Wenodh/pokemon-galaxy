import { PageLayout } from "@/components/layout/page-layout";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { DemoForm } from "@/components/common/demo-form";

export default function SettingsPage() {
  return (
    <PageLayout>
      <Container>
        <PageHeader
          title="Settings"
          description="Manage your account and preferences."
        />
        <DemoForm />
      </Container>
    </PageLayout>
  );
}
