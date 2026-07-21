import { db, libsqlClient, ensureWorkJournalFts } from "@/db/client";
import { interviewJournalEntries, workJournalEntries } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import type { WorkJournalType } from "@/db/schema";

export async function getInterviewJournalEntries(userId: number) {
  return db.query.interviewJournalEntries.findMany({
    where: eq(interviewJournalEntries.userId, userId),
    orderBy: desc(interviewJournalEntries.date),
    with: { application: true },
  });
}

export async function getInterviewJournalEntry(userId: number, id: number) {
  return db.query.interviewJournalEntries.findFirst({
    where: and(eq(interviewJournalEntries.id, id), eq(interviewJournalEntries.userId, userId)),
    with: { application: true },
  });
}

export async function getWorkJournalEntries(userId: number, type?: WorkJournalType) {
  if (type) {
    return db
      .select()
      .from(workJournalEntries)
      .where(and(eq(workJournalEntries.userId, userId), eq(workJournalEntries.type, type)))
      .orderBy(desc(workJournalEntries.date));
  }
  return db
    .select()
    .from(workJournalEntries)
    .where(eq(workJournalEntries.userId, userId))
    .orderBy(desc(workJournalEntries.date));
}

export async function searchWorkJournal(userId: number, query: string) {
  if (!query.trim()) return [];
  await ensureWorkJournalFts();
  const result = await libsqlClient.execute({
    sql: `
      SELECT work_journal_entries.*
      FROM work_journal_fts
      JOIN work_journal_entries ON work_journal_entries.id = work_journal_fts.rowid
      WHERE work_journal_fts MATCH ? AND work_journal_entries.user_id = ?
      ORDER BY rank
      LIMIT 50
    `,
    args: [`${query}*`, userId],
  });
  return result.rows.map((row) => ({
    ...row,
    tags: JSON.parse((row.tags as string) ?? "[]"),
  })) as unknown as (typeof workJournalEntries.$inferSelect)[];
}
