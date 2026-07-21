import { db } from "../client";
import { workJournalEntries, interviewJournalEntries, applications } from "../schema";
import { WORK_JOURNAL_ENTRIES, INTERVIEW_JOURNAL_ENTRIES } from "./data/journals.data";
import { addDays, today } from "../../lib/date";
import { and, eq } from "drizzle-orm";

export async function seedJournals(userId: number) {
  for (const entry of WORK_JOURNAL_ENTRIES) {
    await db.insert(workJournalEntries).values({
      userId,
      date: addDays(today(), -entry.daysAgo),
      type: entry.type,
      title: entry.title,
      content: entry.content,
      tags: entry.tags,
    });
  }

  for (const entry of INTERVIEW_JOURNAL_ENTRIES) {
    const [application] = await db
      .select()
      .from(applications)
      .where(and(eq(applications.userId, userId), eq(applications.company, entry.company)));
    await db.insert(interviewJournalEntries).values({
      userId,
      company: entry.company,
      round: entry.round,
      date: addDays(today(), -entry.daysAgo),
      questions: entry.questions,
      performanceRating: entry.performanceRating,
      mistakes: entry.mistakes,
      lessons: entry.lessons,
      topicsToRevise: entry.topicsToRevise,
      result: entry.result,
      applicationId: application?.id ?? null,
    });
  }
}
