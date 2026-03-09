import type { StateCreator } from "zustand";
import type { AppState } from "@/stores/app";

export type UISlice = {
  // Mobile layout
  leftNavOpen: boolean;
  rightSidebarOpen: boolean;
  toggleLeftNav: () => void;
  toggleRightSidebar: () => void;
  closeAllPanels: () => void;

  // Error management
  clearError: () => void;

  // View modes
  showSavedQueries: boolean;
  setShowSavedQueries: (show: boolean) => void;

  // Home navigation
  goHome: () => void;

  // Reset all state (called on sign-out)
  resetStore: () => void;
};

export const createUISlice: StateCreator<AppState, [], [], UISlice> = (set) => ({
  // Mobile layout
  leftNavOpen: false,
  rightSidebarOpen: false,

  toggleLeftNav: () => {
    set((state) => ({ leftNavOpen: !state.leftNavOpen, rightSidebarOpen: false }));
  },

  toggleRightSidebar: () => {
    set((state) => ({ rightSidebarOpen: !state.rightSidebarOpen, leftNavOpen: false }));
  },

  closeAllPanels: () => {
    set({ leftNavOpen: false, rightSidebarOpen: false });
  },

  showSavedQueries: false,
  setShowSavedQueries: (show: boolean) => {
    set({ showSavedQueries: show, selectedSource: null, currentQuery: null, queryError: null });
  },

  clearError: () => {
    set({ queryError: null });
  },

  goHome: () => {
    set({
      currentQuery: null,
      queryError: null,
      queryLoading: false,
      loadingPhase: null,
      selectedSource: null,
      sourceArticles: [],
      showSavedQueries: false,
    });
  },

  resetStore: () => {
    set({
      sources: [],
      sourcesLoading: false,
      currentQuery: null,
      queryLoading: false,
      queryError: null,
      loadingPhase: null,
      recentQueries: [],
      recentArticles: [],
      queryCountToday: 0,
      selectedSource: null,
      sourceArticles: [],
      sourceArticlesLoading: false,
      showAllSources: false,
      showSavedQueries: false,
      leftNavOpen: false,
      rightSidebarOpen: false,
      lastIngestionTime: null,
      totalArticleCount: 0,
    });
  },
});
