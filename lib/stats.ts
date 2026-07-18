import { db } from "@/db/client";
import { dsaProblems, dsaTopics } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

export type TopicStat = {
  topicId: number;
  topicName: string;
  total: number;
  solved: number;
};

export type DifficultyStat = {
  difficulty: string;
  total: number;
  solved: number;
};

export type CompanyStat = {
  company: string;
  count: number;
};

export async function getTopicStats(): Promise<TopicStat[]> {
  const rows = await db
    .select({
      topicId: dsaTopics.id,
      topicName: dsaTopics.name,
      total: sql<number>`count(${dsaProblems.id})`,
      solved: sql<number>`sum(case when ${dsaProblems.status} in ('solved','mastered') then 1 else 0 end)`,
    })
    .from(dsaTopics)
    .leftJoin(dsaProblems, and(eq(dsaProblems.topicId, dsaTopics.id), eq(dsaProblems.isCore, true)))
    .groupBy(dsaTopics.id)
    .orderBy(dsaTopics.sortOrder);
  return rows.map((r) => ({ ...r, solved: r.solved ?? 0 }));
}

export async function getDifficultyStats(): Promise<DifficultyStat[]> {
  const rows = await db
    .select({
      difficulty: dsaProblems.difficulty,
      total: sql<number>`count(*)`,
      solved: sql<number>`sum(case when ${dsaProblems.status} in ('solved','mastered') then 1 else 0 end)`,
    })
    .from(dsaProblems)
    .where(eq(dsaProblems.isCore, true))
    .groupBy(dsaProblems.difficulty);
  return rows;
}

/** `includeCompanyExtras` set true shows the full real per-company list (used by /dsa/companies); the core Topic Progress chart stays scoped to the curated set. */
export async function getCompanyStats(includeCompanyExtras = false): Promise<CompanyStat[]> {
  const rows = await db
    .select({ companyTags: dsaProblems.companyTags })
    .from(dsaProblems)
    .where(includeCompanyExtras ? undefined : eq(dsaProblems.isCore, true));
  const counts = new Map<string, number>();
  for (const row of rows) {
    for (const company of row.companyTags ?? []) {
      counts.set(company, (counts.get(company) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([company, count]) => ({ company, count }))
    .sort((a, b) => b.count - a.count);
}
