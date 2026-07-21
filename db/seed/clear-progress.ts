import { eq } from "drizzle-orm";
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
 * Zeroes out one user's tracked progress while keeping the curated DSA
 * problem bank and roadmap topic catalog intact — for switching from
 * demo/preview data to a real, blank slate at the start of an actual
 * study run. Scoped to `userId` — never touches another account's data.
 */
export async function clearAllProgress(userId: number) {
  await db.delete(dailyPlanProblems).where(eq(dailyPlanProblems.userId, userId));
  await db.delete(dailyPlans).where(eq(dailyPlans.userId, userId));
  await db.delete(studySessions).where(eq(studySessions.userId, userId));
  await db.delete(dsaAttempts).where(eq(dsaAttempts.userId, userId));
  await db.delete(interviewJournalEntries).where(eq(interviewJournalEntries.userId, userId));
  await db.delete(applications).where(eq(applications.userId, userId));
  await db.delete(workJournalEntries).where(eq(workJournalEntries.userId, userId));
  await db.delete(weeklyReviews).where(eq(weeklyReviews.userId, userId));

  await db
    .update(dsaProblems)
    .set({
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
    })
    .where(eq(dsaProblems.userId, userId));

  await db
    .update(roadmapTopics)
    .set({
      status: "not_started",
      notes: null,
      completedAt: null,
    })
    .where(eq(roadmapTopics.userId, userId));

  await rebuildWorkJournalSearchIndex();
}
