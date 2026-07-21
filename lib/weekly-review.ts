import { db } from "@/db/client";
import {
  studySessions,
  dsaAttempts,
  roadmapTopics,
  applications,
  interviewJournalEntries,
  weeklyReviews,
} from "@/db/schema";
import { and, gte, lte, sql, eq } from "drizzle-orm";
import { weekRange } from "./date";

export async function generateWeeklyReview(userId: number, weekStartDate?: string) {
  const { start, end } = weekRange(weekStartDate);

  const [[hoursRow], [problemsRow], [topicsRow], [applicationsRow], [interviewsRow], [existing]] =
    await Promise.all([
      db
        .select({ minutes: sql<number>`coalesce(sum(${studySessions.durationMinutes}), 0)` })
        .from(studySessions)
        .where(and(eq(studySessions.userId, userId), gte(studySessions.date, start), lte(studySessions.date, end))),
      db
        .select({ count: sql<number>`count(distinct ${dsaAttempts.problemId})` })
        .from(dsaAttempts)
        .where(
          and(
            eq(dsaAttempts.userId, userId),
            gte(dsaAttempts.attemptDate, start),
            lte(dsaAttempts.attemptDate, end),
            sql`${dsaAttempts.result} in ('solved','optimal')`
          )
        ),
      db
        .select({ count: sql<number>`count(*)` })
        .from(roadmapTopics)
        .where(
          and(eq(roadmapTopics.userId, userId), gte(roadmapTopics.completedAt, start), lte(roadmapTopics.completedAt, end))
        ),
      db
        .select({ count: sql<number>`count(*)` })
        .from(applications)
        .where(and(eq(applications.userId, userId), gte(applications.appliedDate, start), lte(applications.appliedDate, end))),
      db
        .select({ count: sql<number>`count(*)` })
        .from(interviewJournalEntries)
        .where(
          and(
            eq(interviewJournalEntries.userId, userId),
            gte(interviewJournalEntries.date, start),
            lte(interviewJournalEntries.date, end)
          )
        ),
      db
        .select()
        .from(weeklyReviews)
        .where(and(eq(weeklyReviews.userId, userId), eq(weeklyReviews.weekStartDate, start))),
    ]);

  const values = {
    userId,
    weekStartDate: start,
    weekEndDate: end,
    hoursStudied: Number(((hoursRow?.minutes ?? 0) / 60).toFixed(1)),
    problemsSolved: problemsRow?.count ?? 0,
    topicsFinished: topicsRow?.count ?? 0,
    applicationsSubmitted: applicationsRow?.count ?? 0,
    interviewsCompleted: interviewsRow?.count ?? 0,
    generatedAt: new Date().toISOString(),
  };

  if (existing) {
    const [updated] = await db
      .update(weeklyReviews)
      .set(values)
      .where(eq(weeklyReviews.id, existing.id))
      .returning();
    return updated;
  }

  const [created] = await db.insert(weeklyReviews).values(values).returning();
  return created;
}
