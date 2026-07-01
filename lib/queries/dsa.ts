import { db } from "@/db/client";
import { dsaProblems, dsaTopics, dsaPatterns, dsaAttempts } from "@/db/schema";
import { asc, desc, eq, lte } from "drizzle-orm";
import { today } from "../date";

export async function getAllProblems() {
  return db.query.dsaProblems.findMany({
    with: { topic: true, pattern: true },
    orderBy: [asc(dsaProblems.topicId), asc(dsaProblems.id)],
  });
}

export async function getProblemById(id: number) {
  return db.query.dsaProblems.findFirst({
    where: eq(dsaProblems.id, id),
    with: { topic: true, pattern: true, attempts: { orderBy: desc(dsaAttempts.attemptDate) } },
  });
}

export async function getTopics() {
  return db.select().from(dsaTopics).orderBy(asc(dsaTopics.sortOrder));
}

export async function getPatterns() {
  return db.select().from(dsaPatterns).orderBy(asc(dsaPatterns.sortOrder));
}

export async function getRevisionsDue(limit = 20) {
  return db.query.dsaProblems.findMany({
    where: lte(dsaProblems.nextRevisionDate, today()),
    with: { topic: true },
    orderBy: asc(dsaProblems.nextRevisionDate),
    limit,
  });
}
