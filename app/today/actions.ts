"use server";

import { db } from "@/db/client";
import { dailyPlanProblems, dailyPlans, roadmapTopics, studySessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { today } from "@/lib/date";
import { logAttempt } from "@/app/dsa/actions";

/**
 * Checking a problem off in Today's Plan needs to actually advance its DSA
 * tracker status and spaced-repetition schedule — otherwise a "done" problem
 * keeps its `not_started` status (or an unchanged `nextRevisionDate`) and
 * gets reassigned as new/due-for-revision on every following day forever.
 */
export async function togglePlanProblem(id: number, completed: boolean) {
  const [row] = await db.select().from(dailyPlanProblems).where(eq(dailyPlanProblems.id, id));
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
  await db
    .update(roadmapTopics)
    .set({ status: completed ? "completed" : "in_progress", completedAt: completed ? today() : null })
    .where(eq(roadmapTopics.id, topicId));
  revalidatePath("/today");
  revalidatePath("/");
}

export async function saveDailyPlanFields(
  planId: number,
  fields: Partial<{ workReflection: string; endOfDayReflection: string; notes: string }>
) {
  await db.update(dailyPlans).set(fields).where(eq(dailyPlans.id, planId));
  revalidatePath("/today");
}

/**
 * Creates the session row on Start (duration 0) and keeps updating the same
 * row every ~60s while the timer runs, rather than only writing once on
 * "Stop & log". A client-side timer only lives in the browser tab — closing
 * it, letting the laptop sleep, or the tab getting reclaimed by the browser
 * loses everything not yet sent to the server. Autosaving means the worst
 * case is losing the last ~60s, not the entire session.
 */
export async function upsertStudySession(input: {
  id?: number;
  durationMinutes: number;
  category: string;
  notes?: string;
}) {
  if (input.id) {
    const [updated] = await db
      .update(studySessions)
      .set({ durationMinutes: input.durationMinutes, notes: input.notes })
      .where(eq(studySessions.id, input.id))
      .returning();
    revalidatePath("/today");
    revalidatePath("/");
    return updated;
  }

  const [created] = await db
    .insert(studySessions)
    .values({
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
