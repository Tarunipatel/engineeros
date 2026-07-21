import { db } from "@/db/client";
import { dailyPlanProblems, dailyPlans, dsaProblems, dsaTopics, studySessions, dsaAttempts } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { getOrGenerateDailyPlan } from "../today-plan";

async function getPlanDetails(resolvedPlan: typeof dailyPlans.$inferSelect) {
  const [systemDesignTopic, pythonTopic, postgresqlTopic, coreCsTopic, planProblems] = await Promise.all([
    resolvedPlan.systemDesignTopicId
      ? db.query.roadmapTopics.findFirst({ where: (t, { eq }) => eq(t.id, resolvedPlan.systemDesignTopicId!) })
      : null,
    resolvedPlan.pythonTopicId
      ? db.query.roadmapTopics.findFirst({ where: (t, { eq }) => eq(t.id, resolvedPlan.pythonTopicId!) })
      : null,
    resolvedPlan.postgresqlTopicId
      ? db.query.roadmapTopics.findFirst({ where: (t, { eq }) => eq(t.id, resolvedPlan.postgresqlTopicId!) })
      : null,
    resolvedPlan.coreCsTopicId
      ? db.query.roadmapTopics.findFirst({ where: (t, { eq }) => eq(t.id, resolvedPlan.coreCsTopicId!) })
      : null,
    db
      .select({
        id: dailyPlanProblems.id,
        kind: dailyPlanProblems.kind,
        completed: dailyPlanProblems.completed,
        problemId: dsaProblems.id,
        title: dsaProblems.title,
        difficulty: dsaProblems.difficulty,
        topicName: dsaTopics.name,
      })
      .from(dailyPlanProblems)
      .innerJoin(dsaProblems, eq(dailyPlanProblems.problemId, dsaProblems.id))
      .innerJoin(dsaTopics, eq(dsaProblems.topicId, dsaTopics.id))
      .where(eq(dailyPlanProblems.dailyPlanId, resolvedPlan.id)),
  ]);

  return { plan: resolvedPlan, systemDesignTopic, pythonTopic, postgresqlTopic, coreCsTopic, planProblems };
}

export async function getTodayPlanWithDetails(userId: number, date?: string) {
  const resolvedPlan = await getOrGenerateDailyPlan(userId, date);
  return getPlanDetails(resolvedPlan);
}

/**
 * Looks up a past day's plan without generating one — viewing history for a
 * date you never actually opened the app on should show "nothing recorded",
 * not silently create a brand-new plan assigning fresh problems retroactively.
 */
export async function getExistingDayPlanWithDetails(userId: number, date: string) {
  const existing = await db.query.dailyPlans.findFirst({
    where: (dp, { eq, and }) => and(eq(dp.userId, userId), eq(dp.date, date)),
  });
  if (!existing) return null;
  return getPlanDetails(existing);
}

export async function getDayActivitySummary(userId: number, date: string) {
  const [sessions, attempts, [totals]] = await Promise.all([
    db
      .select()
      .from(studySessions)
      .where(and(eq(studySessions.userId, userId), eq(studySessions.date, date))),
    db
      .select({
        id: dsaAttempts.id,
        result: dsaAttempts.result,
        timeTakenMinutes: dsaAttempts.timeTakenMinutes,
        confidence: dsaAttempts.confidence,
        problemTitle: dsaProblems.title,
      })
      .from(dsaAttempts)
      .innerJoin(dsaProblems, eq(dsaAttempts.problemId, dsaProblems.id))
      .where(and(eq(dsaAttempts.userId, userId), eq(dsaAttempts.attemptDate, date))),
    db
      .select({ minutes: sql<number>`coalesce(sum(${studySessions.durationMinutes}), 0)` })
      .from(studySessions)
      .where(and(eq(studySessions.userId, userId), eq(studySessions.date, date))),
  ]);

  return { sessions, attempts, totalMinutes: totals?.minutes ?? 0 };
}
