"use server";

import { db } from "@/db/client";
import { dsaProblems, dsaAttempts } from "@/db/schema";
import type { AttemptResult, Difficulty, ProblemStatus } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { computeNextRevision } from "@/lib/spaced-repetition";
import { today } from "@/lib/date";
import { getProblemById } from "@/lib/queries/dsa";
import { requireAuthenticatedUser } from "@/lib/session";

export async function getProblemDetail(id: number) {
  const user = await requireAuthenticatedUser();
  return getProblemById(user.id, id);
}

export async function toggleFavorite(id: number, favorite: boolean) {
  const user = await requireAuthenticatedUser();
  await db
    .update(dsaProblems)
    .set({ favorite })
    .where(and(eq(dsaProblems.id, id), eq(dsaProblems.userId, user.id)));
  revalidatePath("/dsa");
}

export async function updateProblemTopic(id: number, topicId: number) {
  const user = await requireAuthenticatedUser();
  await db
    .update(dsaProblems)
    .set({ topicId, updatedAt: new Date().toISOString() })
    .where(and(eq(dsaProblems.id, id), eq(dsaProblems.userId, user.id)));
  revalidatePath("/dsa/kanban");
}

export async function updateProblemStatus(id: number, status: ProblemStatus) {
  const user = await requireAuthenticatedUser();
  await db
    .update(dsaProblems)
    .set({ status, updatedAt: new Date().toISOString() })
    .where(and(eq(dsaProblems.id, id), eq(dsaProblems.userId, user.id)));
  revalidatePath("/dsa");
}

export async function updateProblemDetails(
  id: number,
  fields: Partial<{
    notes: string;
    mistakes: string;
    confidence: number;
    timeTakenMinutes: number;
    url: string;
    companyTags: string[];
  }>
) {
  const user = await requireAuthenticatedUser();
  await db
    .update(dsaProblems)
    .set({ ...fields, updatedAt: new Date().toISOString() })
    .where(and(eq(dsaProblems.id, id), eq(dsaProblems.userId, user.id)));
  revalidatePath("/dsa");
}

export async function logAttempt(
  id: number,
  input: { result: AttemptResult; timeTakenMinutes?: number; confidence?: number; notes?: string }
) {
  const user = await requireAuthenticatedUser();
  const [problem] = await db
    .select()
    .from(dsaProblems)
    .where(and(eq(dsaProblems.id, id), eq(dsaProblems.userId, user.id)));
  if (!problem) return;

  const attemptDate = today();
  await db.insert(dsaAttempts).values({
    userId: user.id,
    problemId: id,
    attemptDate,
    result: input.result,
    timeTakenMinutes: input.timeTakenMinutes,
    confidence: input.confidence,
    notes: input.notes,
  });

  const revision = computeNextRevision({
    revisionCount: problem.revisionCount,
    easeFactor: problem.easeFactor,
    result: input.result,
    confidence: input.confidence,
  });

  const newStatus: ProblemStatus =
    input.result === "failed"
      ? "attempted"
      : input.result === "optimal" && problem.status !== "not_started"
        ? "mastered"
        : "solved";

  await db
    .update(dsaProblems)
    .set({
      status: newStatus,
      lastAttemptDate: attemptDate,
      firstAttemptDate: problem.firstAttemptDate ?? attemptDate,
      timeTakenMinutes: input.timeTakenMinutes ?? problem.timeTakenMinutes,
      confidence: input.confidence ?? problem.confidence,
      revisionCount: revision.revisionCount,
      easeFactor: revision.easeFactor,
      nextRevisionDate: revision.nextRevisionDate,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(dsaProblems.id, id));

  revalidatePath("/dsa");
  revalidatePath("/");
}

export async function createProblem(input: {
  title: string;
  platform: string;
  url?: string;
  difficulty: Difficulty;
  topicId: number;
  patternId?: number;
  companyTags?: string[];
}) {
  const user = await requireAuthenticatedUser();
  const [created] = await db
    .insert(dsaProblems)
    .values({
      userId: user.id,
      title: input.title,
      platform: input.platform,
      url: input.url,
      difficulty: input.difficulty,
      topicId: input.topicId,
      patternId: input.patternId,
      companyTags: input.companyTags ?? [],
    })
    .returning();
  revalidatePath("/dsa");
  return created;
}
