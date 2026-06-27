import { PageLayout } from "@/components/layout/page-layout";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Button } from "@/components/ui/button";
import { Rocket, Sparkles, Shield, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <PageLayout>
      <Container>
        <Section className="flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Phase 0: The Foundation is Live</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700">
            Explore the Pokémon <br />
            <span className="text-primary">Galaxy</span> with Precision
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 mb-10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            A premium, high-performance Pokémon explorer built for the next
            generation. Experience the Pokédex like never before with a modern
            SaaS-inspired interface.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <Button size="lg" asChild>
              <Link href="/pokedex">Explore Pokédex</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/battle">Battle Analyzer</Link>
            </Button>
          </div>
        </Section>

        <Section>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <Rocket className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Fast by Design</h3>
              <p className="text-muted-foreground">
                Built on Next.js 15 and React 19 for unmatched performance and
                stability.
              </p>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Modern UI/UX</h3>
              <p className="text-muted-foreground">
                Clean, minimal, and dark-first interface inspired by industry
                leaders like Linear and Vercel.
              </p>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg sm:col-span-2 lg:col-span-1">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Type Safe</h3>
              <p className="text-muted-foreground">
                Strict TypeScript and Zod validation ensure a robust and
                maintainable codebase.
              </p>
            </div>
          </div>
        </Section>
      </Container>
    </PageLayout>
  );
}
