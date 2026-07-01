"use server";

import { db } from "@/db/client";
import { workJournalEntries } from "@/db/schema";
import type { WorkJournalType } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { today } from "@/lib/date";
import { searchWorkJournal } from "@/lib/queries/journals";

export async function createWorkJournalEntry(input: {
  type: WorkJournalType;
  title: string;
  content: string;
  tags: string[];
  date?: string;
}) {
  const [created] = await db
    .insert(workJournalEntries)
    .values({ ...input, date: input.date ?? today() })
    .returning();
  revalidatePath("/work-journal");
  return created;
}

export async function searchWorkJournalAction(query: string) {
  return await searchWorkJournal(query);
}
