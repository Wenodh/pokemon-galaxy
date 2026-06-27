"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { LoadingSpinner } from "@/components/common/loading-spinner";

interface InfiniteLoaderProps {
  onLoadMore: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export function InfiniteLoader({
  onLoadMore,
  hasNextPage,
  isFetchingNextPage,
}: InfiniteLoaderProps) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      onLoadMore();
    }
  }, [inView, hasNextPage, isFetchingNextPage, onLoadMore]);

  if (!hasNextPage) return null;

  return (
    <div ref={ref} className="flex justify-center py-8">
      {isFetchingNextPage && <LoadingSpinner size={32} />}
    </div>
  );
}
