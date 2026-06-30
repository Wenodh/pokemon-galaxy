"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SearchInput } from "@/components/common/search-input";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

interface PokemonSearchProps {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function PokemonSearch({ className, value: externalValue, onChange: setExternalValue }: PokemonSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [internalValue, setInternalValue] = React.useState(searchParams.get("search") || "");

  const value = externalValue !== undefined ? externalValue : internalValue;
  const setValue = setExternalValue || setInternalValue;

  const debouncedValue = useDebounce(value, 300);

  React.useEffect(() => {
    if (setExternalValue) return; // Skip URL sync if managed externally

    const params = new URLSearchParams(searchParams.toString());
    if (debouncedValue) {
      params.set("search", debouncedValue);
    } else {
      params.delete("search");
    }

    // Only push if the search parameter actually changed to avoid unnecessary navigation
    const currentSearch = searchParams.get("search") || "";
    if (debouncedValue !== currentSearch) {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [debouncedValue, router, searchParams, setExternalValue, pathname]);

  return (
    <SearchInput
      placeholder="Search by name or number..."
      className={cn("max-w-md w-full", className)}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
