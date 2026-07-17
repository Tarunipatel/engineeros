import { db } from "@/db/client";
import { dsaProblems } from "@/db/schema";
import { DSA_PROBLEMS } from "@/db/seed/data/dsa-problems.data";
import { eq } from "drizzle-orm";

/**
 * One-off maintenance endpoint to push updated companyTags from the seed
 * data onto existing dsa_problems rows in production, matched by title.
 * Only touches companyTags — leaves status/notes/attempts/everything else
 * on the real rows untouched. Protected by the same auth middleware as the
 * rest of the app. Remove this route after running it once.
 */
export async function GET() {
  const rows = await db.select({ id: dsaProblems.id, title: dsaProblems.title }).from(dsaProblems);
  const tagsByTitle = new Map(DSA_PROBLEMS.map((p) => [p.title, p.companyTags]));

  let updated = 0;
  const unmatched: string[] = [];
  for (const row of rows) {
    const tags = tagsByTitle.get(row.title);
    if (!tags) {
      unmatched.push(row.title);
      continue;
    }
    await db.update(dsaProblems).set({ companyTags: tags }).where(eq(dsaProblems.id, row.id));
    updated++;
  }

  return Response.json({ totalRows: rows.length, updated, unmatched });
}
