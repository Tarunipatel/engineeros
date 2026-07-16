import { create } from "zustand";
import { persist } from "zustand/middleware";

type TimerCategory = "dsa" | "system_design" | "python" | "postgresql" | "core_cs" | "work_journal" | "other";

type TimerStore = {
  running: boolean;
  startedAt: number | null;
  elapsedSeconds: number;
  category: TimerCategory;
  sessionId: number | null;
  setCategory: (category: TimerCategory) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
  setSessionId: (id: number | null) => void;
};

/**
 * Persisted to localStorage: an in-memory-only timer is wiped by closing the
 * tab, the browser reclaiming an inactive tab, or the laptop sleeping — all
 * of which happen constantly in normal use. Persisting means a page reload
 * resumes the running timer from `startedAt` instead of losing it outright.
 */
export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      running: false,
      startedAt: null,
      elapsedSeconds: 0,
      category: "dsa",
      sessionId: null,
      setCategory: (category) => set({ category }),
      start: () => set({ running: true, startedAt: Date.now() - get().elapsedSeconds * 1000 }),
      pause: () => set({ running: false }),
      reset: () => set({ running: false, startedAt: null, elapsedSeconds: 0, sessionId: null }),
      tick: () => {
        const { startedAt, running } = get();
        if (running && startedAt) {
          set({ elapsedSeconds: Math.floor((Date.now() - startedAt) / 1000) });
        }
      },
      setSessionId: (id) => set({ sessionId: id }),
    }),
    { name: "engineeros-timer" }
  )
);
