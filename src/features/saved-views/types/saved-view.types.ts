import { SortConfig } from "@/features/search/sort";

export interface SavedView {
  /**
   * Unique identifier for the saved view
   */
  id: string;

  /**
   * User-defined name for the view
   */
  name: string;

  /**
   * Search query associated with the view
   */
  search: string;

  /**
   * Sort configuration associated with the view
   */
  sort: SortConfig;

  /**
   * Reserved for future expansion of the filter engine
   */
  filters?: unknown;

  /**
   * Timestamp when the view was created
   */
  createdAt: number;

  /**
   * Timestamp when the view was last updated
   */
  updatedAt: number;
}

export interface SavedViewStoreState {
  /**
   * Map of saved views by their ID for O(1) lookup
   */
  views: Record<string, SavedView>;

  /**
   * Array of view IDs to maintain order (e.g., by creation date)
   */
  viewIds: string[];

  /**
   * The ID of the currently applied view, if any
   */
  activeViewId: string | null;
}

export interface SavedViewActions {
  /**
   * Saves a new view or updates an existing one
   */
  saveView: (view: Omit<SavedView, "id" | "createdAt" | "updatedAt"> & { id?: string }) => { success: boolean; error?: string };

  /**
   * Deletes a view by its ID
   */
  deleteView: (id: string) => void;

  /**
   * Duplicates an existing view
   */
  duplicateView: (id: string) => void;

  /**
   * Sets the active view
   */
  applyView: (id: string | null) => void;

  /**
   * Renames an existing view
   */
  renameView: (id: string, newName: string) => { success: boolean; error?: string };
}
