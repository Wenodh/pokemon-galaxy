import { PageLayout } from "@/components/layout/page-layout";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { DemoForm } from "@/components/common/demo-form";
import { SyncSettings } from "@/features/cloud-sync/components/sync-settings";

export default function SettingsPage() {
  return (
    <PageLayout>
      <Container>
        <PageHeader
          title="Settings"
          description="Manage your account and preferences."
        />

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <DemoForm />
          </div>
          <div className="lg:col-span-5">
            <SyncSettings />
          </div>
        </div>
      </Container>
    </PageLayout>
  );
}
