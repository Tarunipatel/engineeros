import { db, rebuildWorkJournalSearchIndex } from "../client";
import {
  dsaProblems,
  dsaAttempts,
  roadmapTopics,
  dailyPlans,
  dailyPlanProblems,
  studySessions,
  applications,
  interviewJournalEntries,
  workJournalEntries,
  weeklyReviews,
} from "../schema";

/**
 * Zeroes out all tracked progress while keeping the curated DSA problem bank
 * and roadmap topic catalog intact — for switching from demo/preview data to
 * a real, blank slate at the start of an actual study run.
 */
export async function clearAllProgress() {
  await db.delete(dailyPlanProblems);
  await db.delete(dailyPlans);
  await db.delete(studySessions);
  await db.delete(dsaAttempts);
  await db.delete(interviewJournalEntries);
  await db.delete(applications);
  await db.delete(workJournalEntries);
  await db.delete(weeklyReviews);

  await db.update(dsaProblems).set({
    status: "not_started",
    favorite: false,
    timeTakenMinutes: null,
    confidence: null,
    mistakes: null,
    notes: null,
    firstAttemptDate: null,
    lastAttemptDate: null,
    revisionCount: 0,
    nextRevisionDate: null,
    easeFactor: 2.5,
    updatedAt: new Date().toISOString(),
  });

  await db.update(roadmapTopics).set({
    status: "not_started",
    notes: null,
    completedAt: null,
  });

  await rebuildWorkJournalSearchIndex();
}
