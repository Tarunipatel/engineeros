import { db, libsqlClient } from "@/db/client";
import { dsaProblems } from "@/db/schema";
import { DSA_PROBLEMS } from "@/db/seed/data/dsa-problems.data";
import { eq } from "drizzle-orm";

/**
 * One-off maintenance endpoint: adds the is_core column (Drizzle's query
 * builder needs it to already exist on the live table before any query
 * referencing it will work, so this runs a raw ALTER TABLE first) and sets
 * isCore=false on the 160 problems added for company-wise browsing only,
 * so the core Table/Kanban/Topic Progress views go back to the original
 * 75-problem curriculum while /dsa/companies keeps showing everything.
 * Protected by the same auth middleware as the rest of the app. Remove
 * this route after running it once.
 */
export async function GET() {
  try {
    await libsqlClient.execute("ALTER TABLE dsa_problems ADD COLUMN is_core INTEGER NOT NULL DEFAULT 1");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (!message.includes("duplicate column")) throw err;
  }

  const nonCoreTitles = new Set(DSA_PROBLEMS.filter((p) => p.isCore === false).map((p) => p.title));
  const rows = await db.select({ id: dsaProblems.id, title: dsaProblems.title }).from(dsaProblems);

  let markedNonCore = 0;
  for (const row of rows) {
    if (nonCoreTitles.has(row.title)) {
      await db.update(dsaProblems).set({ isCore: false }).where(eq(dsaProblems.id, row.id));
      markedNonCore++;
    }
  }

  return Response.json({ totalRows: rows.length, expectedNonCore: nonCoreTitles.size, markedNonCore });
}
