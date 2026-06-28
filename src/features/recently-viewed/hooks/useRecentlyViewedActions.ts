import { useShallow } from "zustand/react/shallow";
import { useRecentlyViewedStore } from "../store/recently-viewed.store";

/**
 * Hook to access recently viewed actions.
 */
export const useRecentlyViewedActions = () => {
  return useRecentlyViewedStore(
    useShallow((state) => ({
      addRecent: state.addRecent,
      clearHistory: state.clearHistory,
    }))
  );
};
