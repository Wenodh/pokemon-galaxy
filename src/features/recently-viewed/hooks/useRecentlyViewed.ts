import { useRecentlyViewedStore } from "../store/recently-viewed.store";

/**
 * Hook to access recently viewed IDs and count.
 */
export const useRecentlyViewed = () => {
  const recentIds = useRecentlyViewedStore((state) => state.recentIds);
  const recentCount = useRecentlyViewedStore((state) => state.recentIds.length);

  return {
    recentIds,
    recentCount,
  };
};
