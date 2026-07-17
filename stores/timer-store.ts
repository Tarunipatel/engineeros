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
const STORE_NAME = "engineeros-timer";

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
    { name: STORE_NAME }
  )
);

/**
 * Zustand's `persist` middleware only reads localStorage once, at store
 * creation. If the app is open in two tabs, the tab that was opened first
 * keeps a stale in-memory snapshot even after the other tab starts the
 * timer — so its UI still shows "Start"/0:00, and clicking Start there
 * overwrites the running timer's saved state with a fresh, blank one. This
 * listens for the other tab's writes and re-syncs this tab's state
 * immediately, so a second tab never goes stale in the first place.
 */
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === STORE_NAME) {
      useTimerStore.persist.rehydrate();
    }
  });
}
