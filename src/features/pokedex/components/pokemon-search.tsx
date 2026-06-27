"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchInput } from "@/components/common/search-input";
import { useDebounce } from "@/hooks/use-debounce";

export function PokemonSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = React.useState(searchParams.get("search") || "");
  const debouncedValue = useDebounce(value, 300);

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedValue) {
      params.set("search", debouncedValue);
    } else {
      params.delete("search");
    }
    router.push(`/pokedex?${params.toString()}`, { scroll: false });
  }, [debouncedValue, router, searchParams]);

  return (
    <SearchInput
      placeholder="Search by name or number..."
      className="max-w-md w-full"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
