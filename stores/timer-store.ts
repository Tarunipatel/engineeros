import { create } from "zustand";

type TimerCategory = "dsa" | "system_design" | "python" | "postgresql" | "core_cs" | "work_journal" | "other";

type TimerStore = {
  running: boolean;
  startedAt: number | null;
  elapsedSeconds: number;
  category: TimerCategory;
  setCategory: (category: TimerCategory) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
};

export const useTimerStore = create<TimerStore>((set, get) => ({
  running: false,
  startedAt: null,
  elapsedSeconds: 0,
  category: "dsa",
  setCategory: (category) => set({ category }),
  start: () => set({ running: true, startedAt: Date.now() - get().elapsedSeconds * 1000 }),
  pause: () => set({ running: false }),
  reset: () => set({ running: false, startedAt: null, elapsedSeconds: 0 }),
  tick: () => {
    const { startedAt, running } = get();
    if (running && startedAt) {
      set({ elapsedSeconds: Math.floor((Date.now() - startedAt) / 1000) });
    }
  },
}));
