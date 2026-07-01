import { db } from "@/db/client";
import { dailyPlans, dailyPlanProblems, dsaProblems, roadmapTopics, roadmapDomains } from "@/db/schema";
import type { RoadmapDomainKey } from "@/db/schema";
import { and, asc, eq, lte, or } from "drizzle-orm";
import { today } from "./date";

const NEW_PROBLEMS_PER_DAY = 2;

async function nextIncompleteTopicId(domainKey: RoadmapDomainKey): Promise<number | null> {
  const [domain] = await db.select().from(roadmapDomains).where(eq(roadmapDomains.key, domainKey));
  if (!domain) return null;
  const [topic] = await db
    .select()
    .from(roadmapTopics)
    .where(and(eq(roadmapTopics.domainId, domain.id), or(eq(roadmapTopics.status, "not_started"), eq(roadmapTopics.status, "in_progress"))))
    .orderBy(asc(roadmapTopics.sortOrder))
    .limit(1);
  return topic?.id ?? null;
}

/** Idempotent: returns the existing plan for `date`, generating it on first visit. */
export async function getOrGenerateDailyPlan(date: string = today()) {
  const [existing] = await db.select().from(dailyPlans).where(eq(dailyPlans.date, date));
  if (existing) return existing;

  const [systemDesignTopicId, pythonTopicId, postgresqlTopicId, coreCsTopicId] = await Promise.all([
    nextIncompleteTopicId("system_design"),
    nextIncompleteTopicId("python"),
    nextIncompleteTopicId("postgresql"),
    nextIncompleteTopicId("core_cs"),
  ]);

  const [created] = await db
    .insert(dailyPlans)
    .values({
      date,
      systemDesignTopicId,
      pythonTopicId,
      postgresqlTopicId,
      coreCsTopicId,
    })
    .returning();

  const revisionDue = await db
    .select({ id: dsaProblems.id })
    .from(dsaProblems)
    .where(lte(dsaProblems.nextRevisionDate, date))
    .limit(10);

  const newProblems = await db
    .select({ id: dsaProblems.id })
    .from(dsaProblems)
    .where(eq(dsaProblems.status, "not_started"))
    .orderBy(asc(dsaProblems.topicId))
    .limit(NEW_PROBLEMS_PER_DAY);

  const rows = [
    ...revisionDue.map((p) => ({ dailyPlanId: created.id, problemId: p.id, kind: "revision" as const })),
    ...newProblems.map((p) => ({ dailyPlanId: created.id, problemId: p.id, kind: "new" as const })),
  ];

  if (rows.length > 0) {
    await db.insert(dailyPlanProblems).values(rows);
  }

  return created;
}
