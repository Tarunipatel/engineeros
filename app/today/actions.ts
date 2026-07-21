"use server";

import { db } from "@/db/client";
import { dailyPlanProblems, dailyPlans, roadmapTopics, studySessions } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { today } from "@/lib/date";
import { logAttempt } from "@/app/dsa/actions";
import { requireAuthenticatedUser } from "@/lib/session";

/**
 * Checking a problem off in Today's Plan needs to actually advance its DSA
 * tracker status and spaced-repetition schedule — otherwise a "done" problem
 * keeps its `not_started` status (or an unchanged `nextRevisionDate`) and
 * gets reassigned as new/due-for-revision on every following day forever.
 */
export async function togglePlanProblem(id: number, completed: boolean) {
  const user = await requireAuthenticatedUser();
  const [row] = await db
    .select()
    .from(dailyPlanProblems)
    .where(and(eq(dailyPlanProblems.id, id), eq(dailyPlanProblems.userId, user.id)));
  if (!row) return;

  await db.update(dailyPlanProblems).set({ completed }).where(eq(dailyPlanProblems.id, id));

  // Only log on the false -> true transition, so re-toggling the same day
  // doesn't double-log an attempt or advance the revision schedule twice.
  if (completed && !row.completed) {
    await logAttempt(row.problemId, { result: "solved" });
  }

  revalidatePath("/today");
  revalidatePath("/");
}

export async function toggleRoadmapTopicDone(topicId: number, completed: boolean) {
  const user = await requireAuthenticatedUser();
  await db
    .update(roadmapTopics)
    .set({ status: completed ? "completed" : "in_progress", completedAt: completed ? today() : null })
    .where(and(eq(roadmapTopics.id, topicId), eq(roadmapTopics.userId, user.id)));
  revalidatePath("/today");
  revalidatePath("/");
}

export async function saveDailyPlanFields(
  planId: number,
  fields: Partial<{ workReflection: string; endOfDayReflection: string; notes: string }>
) {
  const user = await requireAuthenticatedUser();
  await db
    .update(dailyPlans)
    .set(fields)
    .where(and(eq(dailyPlans.id, planId), eq(dailyPlans.userId, user.id)));
  revalidatePath("/today");
}

/**
 * Creates the session row on Start (duration 0) and keeps updating the same
 * row every ~60s while the timer runs, rather than only writing once on
 * "Stop & log". A client-side timer only lives in the browser tab — closing
 * it, letting the laptop sleep, or the tab getting reclaimed by the browser
 * loses everything not yet sent to the server. Autosaving means the worst
 * case is losing the last ~60s, not the entire session.
 *
 * `input.id` comes from a client-persisted zustand store (localStorage), so
 * it's treated as untrusted — the update is scoped to the current user, and
 * silently falls through to creating a fresh session if that id doesn't
 * belong to them (e.g. a stale id from a previous account on a shared
 * browser) rather than ever touching someone else's row.
 */
export async function upsertStudySession(input: {
  id?: number;
  durationMinutes: number;
  category: string;
  notes?: string;
}) {
  const user = await requireAuthenticatedUser();

  if (input.id) {
    const [updated] = await db
      .update(studySessions)
      .set({ durationMinutes: input.durationMinutes, notes: input.notes })
      .where(and(eq(studySessions.id, input.id), eq(studySessions.userId, user.id)))
      .returning();
    if (updated) {
      revalidatePath("/today");
      revalidatePath("/");
      return updated;
    }
  }

  const [created] = await db
    .insert(studySessions)
    .values({
      userId: user.id,
      date: today(),
      durationMinutes: input.durationMinutes,
      category: input.category as never,
      notes: input.notes,
    })
    .returning();
  revalidatePath("/today");
  revalidatePath("/");
  return created;
}
