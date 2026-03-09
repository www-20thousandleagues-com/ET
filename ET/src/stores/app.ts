import { create } from "zustand";
import { createQuerySlice, type QuerySlice } from "@/stores/slices/querySlice";
import { createSourceSlice, type SourceSlice } from "@/stores/slices/sourceSlice";
import { createUISlice, type UISlice } from "@/stores/slices/uiSlice";

// Re-export LoadingPhase so existing imports keep working
export type { LoadingPhase } from "@/stores/slices/querySlice";

export type AppState = QuerySlice & SourceSlice & UISlice;

export const useAppStore = create<AppState>()((...a) => ({
  ...createQuerySlice(...a),
  ...createSourceSlice(...a),
  ...createUISlice(...a),
}));
