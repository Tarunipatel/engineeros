"use server";

import { db } from "@/db/client";
import { interviewJournalEntries } from "@/db/schema";
import type { InterviewResult } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
  const [created] = await db.insert(interviewJournalEntries).values(input).returning();
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
  await db.update(interviewJournalEntries).set(input).where(eq(interviewJournalEntries.id, id));
  revalidatePath("/interview-journal");
  revalidatePath(`/interview-journal/${id}`);
}
