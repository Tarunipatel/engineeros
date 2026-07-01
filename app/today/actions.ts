"use server";

import { db } from "@/db/client";
import { dailyPlanProblems, dailyPlans, roadmapTopics, studySessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { today } from "@/lib/date";

export async function togglePlanProblem(id: number, completed: boolean) {
  await db.update(dailyPlanProblems).set({ completed }).where(eq(dailyPlanProblems.id, id));
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

export async function logStudySession(input: {
  durationMinutes: number;
  category: string;
  notes?: string;
}) {
  await db.insert(studySessions).values({
    date: today(),
    durationMinutes: input.durationMinutes,
    category: input.category as never,
    notes: input.notes,
  });
  revalidatePath("/today");
  revalidatePath("/");
}
