import { useShallow } from "zustand/react/shallow";
import { useLivingDexStore } from "../store/living-dex.store";

export function useLivingDexActions() {
  return useLivingDexStore(
    useShallow((state) => ({
      markSeen: state.markSeen,
      markCaught: state.markCaught,
      clearLivingDex: state.clearLivingDex,
    }))
  );
}
