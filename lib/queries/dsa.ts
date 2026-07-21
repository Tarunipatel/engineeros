import { db } from "@/db/client";
import { dsaProblems, dsaTopics, dsaPatterns, dsaAttempts } from "@/db/schema";
import { and, asc, desc, eq, lte } from "drizzle-orm";
import { today } from "../date";

/**
 * `includeCompanyExtras` pulls in problems added purely for company-wise
 * browsing (companies pages) — the core Table/Kanban/Topic Progress views
 * stay scoped to the curated set by default.
 */
export async function getAllProblems(userId: number, includeCompanyExtras = false) {
  return db.query.dsaProblems.findMany({
    where: includeCompanyExtras
      ? eq(dsaProblems.userId, userId)
      : and(eq(dsaProblems.userId, userId), eq(dsaProblems.isCore, true)),
    with: { topic: true, pattern: true },
    orderBy: [asc(dsaProblems.topicId), asc(dsaProblems.id)],
  });
}

export async function getProblemById(userId: number, id: number) {
  return db.query.dsaProblems.findFirst({
    where: and(eq(dsaProblems.id, id), eq(dsaProblems.userId, userId)),
    with: { topic: true, pattern: true, attempts: { orderBy: desc(dsaAttempts.attemptDate) } },
  });
}

export async function getTopics() {
  return db.select().from(dsaTopics).orderBy(asc(dsaTopics.sortOrder));
}

export async function getPatterns() {
  return db.select().from(dsaPatterns).orderBy(asc(dsaPatterns.sortOrder));
}

export async function getRevisionsDue(userId: number, limit = 20) {
  return db.query.dsaProblems.findMany({
    where: and(eq(dsaProblems.userId, userId), lte(dsaProblems.nextRevisionDate, today())),
    with: { topic: true },
    orderBy: asc(dsaProblems.nextRevisionDate),
    limit,
  });
}
