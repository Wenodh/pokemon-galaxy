export interface RecentlyViewedState {
  recentIds: number[];
  version: number;
}

export interface RecentlyViewedActions {
  addRecent: (id: number) => void;
  clearHistory: () => void;
  getRecentCount: () => number;
}

export type RecentlyViewedStore = RecentlyViewedState & RecentlyViewedActions;
