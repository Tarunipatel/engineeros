"use client";

import { useEffect } from "react";
import { useTimerStore } from "@/stores/timer-store";
import { upsertStudySession } from "@/app/today/actions";

const AUTOSAVE_INTERVAL_MS = 60_000;

/**
 * Headless — runs the timer's tick and autosave intervals for the whole app,
 * not just while `/today` is mounted. Without this, navigating away from
 * `/today` while the timer is running would unmount the intervals and the
 * timer would silently stop ticking/saving until you came back.
 */
export function TimerEngine() {
  const { running, tick, category, setSessionId } = useTimerStore();

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [running, tick]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(async () => {
      const minutes = Math.max(1, Math.round(useTimerStore.getState().elapsedSeconds / 60));
      const id = useTimerStore.getState().sessionId;
      const saved = await upsertStudySession({ id: id ?? undefined, durationMinutes: minutes, category });
      if (!id && saved) setSessionId(saved.id);
    }, AUTOSAVE_INTERVAL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  return null;
}
