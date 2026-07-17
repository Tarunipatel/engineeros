import { db } from "@/db/client";
import { dsaProblems, dsaTopics, dsaPatterns } from "@/db/schema";
import { DSA_PROBLEMS } from "@/db/seed/data/dsa-problems.data";
import { DSA_TOPICS, DSA_PATTERNS } from "@/db/seed/data/dsa-topics.data";
import { eq } from "drizzle-orm";

/**
 * One-off maintenance endpoint: applies real, web-verified company tags
 * (github.com/liquidslr/leetcode-company-wise-problems, matched against
 * our existing problems by LeetCode slug) onto production rows, adds any
 * new topics/patterns the new problems need, and inserts the ~18 new
 * problems that rank in real companies' top-20 lists but weren't in our
 * set yet. Existing rows are only UPDATEd on companyTags — status/notes/
 * attempts/progress untouched. Protected by the same auth middleware as
 * the rest of the app. Remove this route after running it once.
 */
export async function GET() {
  // 1. Ensure every topic/pattern in the seed data exists.
  const existingTopics = await db.select().from(dsaTopics);
  const topicIdByName = new Map(existingTopics.map((t) => [t.name, t.id]));
  for (const name of DSA_TOPICS) {
    if (!topicIdByName.has(name)) {
      const [row] = await db.insert(dsaTopics).values({ name, sortOrder: topicIdByName.size }).returning();
      topicIdByName.set(name, row.id);
    }
  }

  const existingPatterns = await db.select().from(dsaPatterns);
  const patternIdByName = new Map(existingPatterns.map((p) => [p.name, p.id]));
  for (const name of DSA_PATTERNS) {
    if (!patternIdByName.has(name)) {
      const [row] = await db.insert(dsaPatterns).values({ name, sortOrder: patternIdByName.size }).returning();
      patternIdByName.set(name, row.id);
    }
  }

  // 2. Update companyTags on existing rows (matched by title), insert new problems.
  const existingRows = await db.select({ id: dsaProblems.id, title: dsaProblems.title }).from(dsaProblems);
  const existingTitles = new Set(existingRows.map((r) => r.title));
  const idByTitle = new Map(existingRows.map((r) => [r.title, r.id]));

  let updated = 0;
  let inserted = 0;
  for (const p of DSA_PROBLEMS) {
    if (existingTitles.has(p.title)) {
      await db.update(dsaProblems).set({ companyTags: p.companyTags }).where(eq(dsaProblems.id, idByTitle.get(p.title)!));
      updated++;
    } else {
      await db.insert(dsaProblems).values({
        title: p.title,
        platform: p.platform,
        url: p.url,
        difficulty: p.difficulty,
        topicId: topicIdByName.get(p.topic)!,
        patternId: patternIdByName.get(p.pattern) ?? null,
        companyTags: p.companyTags,
        status: "not_started",
      });
      inserted++;
    }
  }

  return Response.json({ totalInSeed: DSA_PROBLEMS.length, updated, inserted });
}
