import { create } from "zustand";
import { persist } from "zustand/middleware";

type UiStore = {
  quickNotes: string;
  setQuickNotes: (notes: string) => void;
};

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      quickNotes: "",
      setQuickNotes: (notes) => set({ quickNotes: notes }),
    }),
    { name: "engineeros-ui" }
  )
);
