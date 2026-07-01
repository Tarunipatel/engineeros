import { db } from "@/db/client";
import { dailyPlanProblems, dsaProblems, dsaTopics } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getOrGenerateDailyPlan } from "../today-plan";

export async function getTodayPlanWithDetails(date?: string) {
  const resolvedPlan = await getOrGenerateDailyPlan(date);

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
