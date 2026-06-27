import Link from "next/link";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

export default function PokemonNotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <Container>
        <div className="flex flex-col items-center gap-6">
          <div className="rounded-full bg-muted p-6">
            <SearchX className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter sm:text-6xl">Pokémon Not Found</h1>
            <p className="text-lg text-muted-foreground">
              We couldn&apos;t find the Pokémon you were looking for. It might not exist in our galaxy yet.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="rounded-full font-bold">
              <Link href="/">Back to Explorer</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full font-bold">
              <Link href="/">Try Searching</Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
