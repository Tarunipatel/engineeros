import { db } from "@/db/client";
import { dsaProblems, studySessions, applications, workJournalEntries, settings, roadmapTopics } from "@/db/schema";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { weekRange } from "../date";
import { computeStreak, computeHeatmapData } from "../streak";
import { getRevisionsDue } from "./dsa";

export async function getDashboardData(userId: number) {
  const { start, end } = weekRange();

  const [
    streak,
    heatmap,
    revisionsDue,
    [weekMinutes],
    [problemsSolvedThisWeek],
    [applicationsThisWeek],
    recentWorkEntries,
    [settingsRow],
    roadmapProgress,
  ] = await Promise.all([
    computeStreak(userId),
    computeHeatmapData(userId),
    getRevisionsDue(userId, 5),
    db
      .select({ minutes: sql<number>`coalesce(sum(${studySessions.durationMinutes}), 0)` })
      .from(studySessions)
      .where(and(eq(studySessions.userId, userId), gte(studySessions.date, start))),
    db
      .select({ count: sql<number>`count(*)` })
      .from(dsaProblems)
      .where(
        sql`${dsaProblems.userId} = ${userId} and ${dsaProblems.lastAttemptDate} >= ${start} and ${dsaProblems.lastAttemptDate} <= ${end} and ${dsaProblems.status} in ('solved','mastered')`
      ),
    db
      .select({ count: sql<number>`count(*)` })
      .from(applications)
      .where(and(eq(applications.userId, userId), gte(applications.appliedDate, start))),
    db
      .select()
      .from(workJournalEntries)
      .where(eq(workJournalEntries.userId, userId))
      .orderBy(desc(workJournalEntries.date))
      .limit(4),
    db.select().from(settings).where(eq(settings.userId, userId)).limit(1),
    db
      .select({ status: roadmapTopics.status, count: sql<number>`count(*)` })
      .from(roadmapTopics)
      .where(eq(roadmapTopics.userId, userId))
      .groupBy(roadmapTopics.status),
  ]);

  return {
    streak,
    heatmap,
    revisionsDue,
    weekHours: Number((weekMinutes.minutes / 60).toFixed(1)),
    problemsSolvedThisWeek: problemsSolvedThisWeek.count,
    applicationsThisWeek: applicationsThisWeek.count,
    recentWorkEntries,
    settings: settingsRow,
    roadmapProgress,
  };
}
