import { Search, Layout, Rocket } from "lucide-react";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { PageLayout } from "@/components/layout/page-layout";
import { HomeContent } from "@/features/home/components/home-content";

export default function Home() {
  return (
    <PageLayout>
      <HomeContent />

      {/* Features Section - Static Content */}
      <Section>
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Engineered for Trainers
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              The tools you need to explore the Pokémon world with precision.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Lightning-fast Search</h3>
              <p className="text-muted-foreground leading-relaxed">
                Instantly find any Pokémon by name or Pokédex number with our
                optimized search engine.
              </p>
            </div>
            <div className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <Layout className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Explore by Region</h3>
              <p className="text-muted-foreground leading-relaxed">
                Filter and discover Pokémon from Kanto to Paldea with a single
                click (Coming soon).
              </p>
            </div>
            <div className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <Rocket className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Modern Profiles</h3>
              <p className="text-muted-foreground leading-relaxed">
                Beautiful, detailed profiles with high-resolution artwork and
                comprehensive stats.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </PageLayout>
  );
}
