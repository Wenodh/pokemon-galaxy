import { useCollectionStore } from "../store/collection.store";
import {
  selectSeenCount,
  selectCaughtCount,
  selectShinyCount,
  selectAlphaCount,
  selectLuckyCount,
  selectCompletionPercentage,
} from "../store/collection.selectors";

/**
 * Hook to access collection statistics and completion progress.
 */
export const useCollection = () => {
  const seenCount = useCollectionStore(selectSeenCount);
  const caughtCount = useCollectionStore(selectCaughtCount);
  const shinyCount = useCollectionStore(selectShinyCount);
  const alphaCount = useCollectionStore(selectAlphaCount);
  const luckyCount = useCollectionStore(selectLuckyCount);
  const completionPercentage = useCollectionStore(selectCompletionPercentage);

  return {
    seenCount,
    caughtCount,
    shinyCount,
    alphaCount,
    luckyCount,
    completionPercentage,
  };
};
