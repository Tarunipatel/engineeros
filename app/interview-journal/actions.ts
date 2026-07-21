"use server";

import { db } from "@/db/client";
import { interviewJournalEntries } from "@/db/schema";
import type { InterviewResult } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAuthenticatedUser } from "@/lib/session";

export async function createInterviewEntry(input: {
  company: string;
  round: string;
  date: string;
  questions: string[];
  performanceRating?: number;
  mistakes?: string;
  lessons?: string;
  topicsToRevise: string[];
  result: InterviewResult;
}) {
  const user = await requireAuthenticatedUser();
  const [created] = await db
    .insert(interviewJournalEntries)
    .values({ ...input, userId: user.id })
    .returning();
  revalidatePath("/interview-journal");
  return created;
}

export async function updateInterviewEntry(
  id: number,
  input: Partial<{
    company: string;
    round: string;
    date: string;
    questions: string[];
    performanceRating: number;
    mistakes: string;
    lessons: string;
    topicsToRevise: string[];
    result: InterviewResult;
  }>
) {
  const user = await requireAuthenticatedUser();
  await db
    .update(interviewJournalEntries)
    .set(input)
    .where(and(eq(interviewJournalEntries.id, id), eq(interviewJournalEntries.userId, user.id)));
  revalidatePath("/interview-journal");
  revalidatePath(`/interview-journal/${id}`);
}
