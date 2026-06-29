import { useSavedViewStore } from "../store/saved-views.store";
import { useShallow } from "zustand/react/shallow";

export const useSavedViews = () => {
  return useSavedViewStore(
    useShallow((state) => ({
      views: state.viewIds.map((id) => state.views[id]),
      activeViewId: state.activeViewId,
      activeView: state.activeViewId ? state.views[state.activeViewId] : null,
    }))
  );
};

export const useSavedViewActions = () => {
  return useSavedViewStore(
    useShallow((state) => ({
      saveView: state.saveView,
      deleteView: state.deleteView,
      duplicateView: state.duplicateView,
      applyView: state.applyView,
      renameView: state.renameView,
    }))
  );
};
