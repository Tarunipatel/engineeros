import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { DATABASE_URL, DATABASE_AUTH_TOKEN, isLocalFileDb } from "./env";

export const libsqlClient = createClient({
  url: DATABASE_URL,
  authToken: DATABASE_AUTH_TOKEN,
});

// The client holds one session for its lifetime (a module-scoped singleton per
// server instance), so this pragma applies to every query made through it.
// Foreign key enforcement needs to be requested explicitly either way.
void libsqlClient.execute("PRAGMA foreign_keys = ON").catch(() => {});

// WAL is a local-file-only concept; Turso's remote protocol rejects it
// outright ("SQL not allowed statement") since it manages storage itself.
if (isLocalFileDb) {
  void libsqlClient.execute("PRAGMA journal_mode = WAL").catch(() => {});
}

export const db = drizzle(libsqlClient, { schema });

const FTS_DDL = `
  CREATE VIRTUAL TABLE IF NOT EXISTS work_journal_fts USING fts5(
    title, content, tags, content='work_journal_entries', content_rowid='id'
  );

  CREATE TRIGGER IF NOT EXISTS work_journal_ai AFTER INSERT ON work_journal_entries BEGIN
    INSERT INTO work_journal_fts(rowid, title, content, tags)
    VALUES (new.id, new.title, new.content, new.tags);
  END;

  CREATE TRIGGER IF NOT EXISTS work_journal_ad AFTER DELETE ON work_journal_entries BEGIN
    INSERT INTO work_journal_fts(work_journal_fts, rowid, title, content, tags)
    VALUES ('delete', old.id, old.title, old.content, old.tags);
  END;

  CREATE TRIGGER IF NOT EXISTS work_journal_au AFTER UPDATE ON work_journal_entries BEGIN
    INSERT INTO work_journal_fts(work_journal_fts, rowid, title, content, tags)
    VALUES ('delete', old.id, old.title, old.content, old.tags);
    INSERT INTO work_journal_fts(rowid, title, content, tags)
    VALUES (new.id, new.title, new.content, new.tags);
  END;
`;

let ftsReady: Promise<void> | null = null;

/** Lazily creates the FTS5 table/triggers once per server instance (memoized). */
export function ensureWorkJournalFts(): Promise<void> {
  if (!ftsReady) {
    ftsReady = libsqlClient.executeMultiple(FTS_DDL);
  }
  return ftsReady;
}

/**
 * `drizzle-kit push` doesn't know about this hand-managed FTS5 table (it's not
 * in the Drizzle schema) and will drop/recreate it as an "orphaned" table on
 * every push. Rebuilding resyncs the index from `work_journal_entries` after
 * that happens, so search doesn't go stale even though the underlying rows
 * were never touched.
 */
export async function rebuildWorkJournalSearchIndex() {
  await ensureWorkJournalFts();
  await libsqlClient.execute(`INSERT INTO work_journal_fts(work_journal_fts) VALUES ('rebuild')`);
}
