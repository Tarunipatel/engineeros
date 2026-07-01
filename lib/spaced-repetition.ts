import { addDays, today } from "./date";
import type { AttemptResult } from "@/db/schema";

const BASE_INTERVALS = [1, 3, 7, 14, 30, 60];

type RevisionInput = {
  revisionCount: number;
  easeFactor: number;
  result: AttemptResult;
  confidence?: number | null;
};

type RevisionOutput = {
  nextRevisionDate: string;
  easeFactor: number;
  revisionCount: number;
};

/**
 * Simplified SM-2: interval grows through a fixed ladder scaled by ease factor.
 * Ease factor nudges up on strong results, down on weak ones (clamped 1.3-3.0),
 * mirroring SM-2 without full per-card history.
 */
export function computeNextRevision({
  revisionCount,
  easeFactor,
  result,
  confidence,
}: RevisionInput): RevisionOutput {
  let delta = 0;
  if (result === "optimal") delta = 0.15;
  else if (result === "solved") delta = 0.05;
  else if (result === "solved_with_help") delta = -0.15;
  else delta = -0.3;

  if (typeof confidence === "number") {
    delta += (confidence - 3) * 0.05;
  }

  const nextEaseFactor = Math.min(3.0, Math.max(1.3, easeFactor + delta));

  const failed = result === "failed";
  const nextRevisionCount = failed ? 0 : revisionCount + 1;

  const ladderIndex = Math.min(nextRevisionCount, BASE_INTERVALS.length - 1);
  const baseInterval = BASE_INTERVALS[ladderIndex];
  const scaledInterval = Math.max(1, Math.round(baseInterval * (nextEaseFactor / 2.5)));

  return {
    nextRevisionDate: addDays(today(), scaledInterval),
    easeFactor: Number(nextEaseFactor.toFixed(2)),
    revisionCount: nextRevisionCount,
  };
}
