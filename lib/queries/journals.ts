import { db, libsqlClient, ensureWorkJournalFts } from "@/db/client";
import { interviewJournalEntries, workJournalEntries } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import type { WorkJournalType } from "@/db/schema";

export async function getInterviewJournalEntries() {
  return db.query.interviewJournalEntries.findMany({
    orderBy: desc(interviewJournalEntries.date),
    with: { application: true },
  });
}

export async function getInterviewJournalEntry(id: number) {
  return db.query.interviewJournalEntries.findFirst({
    where: eq(interviewJournalEntries.id, id),
    with: { application: true },
  });
}

export async function getWorkJournalEntries(type?: WorkJournalType) {
  if (type) {
    return db
      .select()
      .from(workJournalEntries)
      .where(eq(workJournalEntries.type, type))
      .orderBy(desc(workJournalEntries.date));
  }
  return db.select().from(workJournalEntries).orderBy(desc(workJournalEntries.date));
}

export async function searchWorkJournal(query: string) {
  if (!query.trim()) return [];
  await ensureWorkJournalFts();
  const result = await libsqlClient.execute({
    sql: `
      SELECT work_journal_entries.*
      FROM work_journal_fts
      JOIN work_journal_entries ON work_journal_entries.id = work_journal_fts.rowid
      WHERE work_journal_fts MATCH ?
      ORDER BY rank
      LIMIT 50
    `,
    args: [`${query}*`],
  });
  return result.rows.map((row) => ({
    ...row,
    tags: JSON.parse((row.tags as string) ?? "[]"),
  })) as unknown as (typeof workJournalEntries.$inferSelect)[];
}
