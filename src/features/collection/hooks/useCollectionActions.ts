import { useShallow } from "zustand/react/shallow";
import { useCollectionStore } from "../store/collection.store";
import { selectActions } from "../store/collection.selectors";

/**
 * Hook to access collection management actions.
 * Uses useShallow to provide a stable reference to the actions object.
 */
export const useCollectionActions = () => {
  return useCollectionStore(useShallow(selectActions));
};
