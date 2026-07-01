import { createClient } from "@libsql/client";
import { DATABASE_URL, DATABASE_AUTH_TOKEN } from "./env";

/**
 * `drizzle-kit push` diffs the live database against schema.ts and doesn't
 * know about the hand-managed `work_journal_fts` virtual table (FTS5 isn't
 * representable in Drizzle's schema). Once that table exists, push crashes
 * trying to reconcile its shadow tables (`_data`/`_idx`/`_docsize`/`_config`)
 * on every subsequent run. Dropping it first means push always sees a clean
 * slate; `db/client.ts` recreates the table and triggers lazily on first use,
 * and the seed script rebuilds the index from `work_journal_entries` afterward.
 */
async function main() {
  const client = createClient({ url: DATABASE_URL, authToken: DATABASE_AUTH_TOKEN });
  await client.executeMultiple(`
    DROP TRIGGER IF EXISTS work_journal_ai;
    DROP TRIGGER IF EXISTS work_journal_ad;
    DROP TRIGGER IF EXISTS work_journal_au;
    DROP TABLE IF EXISTS work_journal_fts;
  `);
  client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
