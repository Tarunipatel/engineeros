import { db } from "../client";
import { dsaTopics, dsaPatterns, dsaProblems, dsaAttempts } from "../schema";
import { DSA_TOPICS, DSA_PATTERNS } from "./data/dsa-topics.data";
import { DSA_PROBLEMS } from "./data/dsa-problems.data";
import { addDays, today } from "../../lib/date";
import { computeNextRevision } from "../../lib/spaced-repetition";

/** dsa_topics/dsa_patterns are shared taxonomy, not per-user — insert only what's missing so this stays safe to call once per new user. */
async function ensureTopicsAndPatterns() {
  const existingTopics = await db.select().from(dsaTopics);
  const topicIdByName = new Map(existingTopics.map((t) => [t.name, t.id]));
  const missingTopics = DSA_TOPICS.filter((name) => !topicIdByName.has(name));
  if (missingTopics.length) {
    const inserted = await db
      .insert(dsaTopics)
      .values(missingTopics.map((name, i) => ({ name, sortOrder: existingTopics.length + i })))
      .returning();
    for (const t of inserted) topicIdByName.set(t.name, t.id);
  }

  const existingPatterns = await db.select().from(dsaPatterns);
  const patternIdByName = new Map(existingPatterns.map((p) => [p.name, p.id]));
  const missingPatterns = DSA_PATTERNS.filter((name) => !patternIdByName.has(name));
  if (missingPatterns.length) {
    const inserted = await db
      .insert(dsaPatterns)
      .values(missingPatterns.map((name, i) => ({ name, sortOrder: existingPatterns.length + i })))
      .returning();
    for (const p of inserted) patternIdByName.set(p.name, p.id);
  }

  return { topicIdByName, patternIdByName };
}

/**
 * Seeds a personal copy of the DSA catalog for one user. `withDemoProgress`
 * fabricates a realistic-looking spread of solved/mastered/attempted status
 * and backdated attempts — used only for the original bootstrap account, not
 * for real new signups, who start with everything not_started.
 */
export async function seedDsa(userId: number, withDemoProgress: boolean) {
  const { topicIdByName, patternIdByName } = await ensureTopicsAndPatterns();

  for (let i = 0; i < DSA_PROBLEMS.length; i++) {
    const p = DSA_PROBLEMS[i];
    const isCore = p.isCore ?? true;
    const mod = i % 5;
    // 0,1 -> mastered/solved (40%), 2 -> attempted (20%), 3,4 -> not_started (40%).
    // Company-extra problems always start not_started — the demo progress
    // distribution only applies to the curated core set.
    const status =
      !withDemoProgress || !isCore
        ? "not_started"
        : mod === 0
          ? "mastered"
          : mod === 1
            ? "solved"
            : mod === 2
              ? "attempted"
              : "not_started";

    let firstAttemptDate: string | null = null;
    let lastAttemptDate: string | null = null;
    let confidence: number | null = null;
    let timeTakenMinutes: number | null = null;
    let revisionCount = 0;
    let nextRevisionDate: string | null = null;
    let easeFactor = 2.5;

    if (status !== "not_started") {
      const attemptsAgo = 5 + (i % 8) * 6; // spread across ~8 weeks
      firstAttemptDate = addDays(today(), -attemptsAgo);
      lastAttemptDate = status === "attempted" ? firstAttemptDate : addDays(firstAttemptDate, 3);
      confidence = status === "mastered" ? 5 : status === "solved" ? 4 : 2;
      timeTakenMinutes = 15 + ((i * 7) % 40);

      if (status !== "attempted") {
        const result = status === "mastered" ? "optimal" : "solved";
        const revision = computeNextRevision({ revisionCount: 0, easeFactor: 2.5, result, confidence });
        revisionCount = revision.revisionCount;
        easeFactor = revision.easeFactor;

        // Distribute revision dates across overdue / due-today / future so the
        // revision-reminder feature has visible data immediately.
        const dueMod = i % 3;
        if (dueMod === 0) nextRevisionDate = addDays(today(), -(1 + (i % 5))); // overdue
        else if (dueMod === 1) nextRevisionDate = today(); // due today
        else nextRevisionDate = revision.nextRevisionDate; // future
      }
    }

    const [inserted] = await db
      .insert(dsaProblems)
      .values({
        userId,
        title: p.title,
        platform: p.platform,
        url: p.url,
        difficulty: p.difficulty,
        topicId: topicIdByName.get(p.topic)!,
        patternId: (p.pattern ? patternIdByName.get(p.pattern) : null) ?? null,
        companyTags: p.companyTags,
        isCore,
        status,
        favorite: withDemoProgress && i % 11 === 0,
        timeTakenMinutes,
        confidence,
        mistakes: status === "attempted" ? "Struggled to identify the right pattern within time limit." : null,
        notes: status === "mastered" ? "Comfortable explaining approach out loud, revisit occasionally." : null,
        firstAttemptDate,
        lastAttemptDate,
        revisionCount,
        nextRevisionDate,
        easeFactor,
      })
      .returning();

    if (status !== "not_started" && firstAttemptDate) {
      const result = status === "mastered" ? "optimal" : status === "solved" ? "solved" : "solved_with_help";
      await db.insert(dsaAttempts).values({
        userId,
        problemId: inserted.id,
        attemptDate: firstAttemptDate,
        result,
        timeTakenMinutes,
        confidence,
        notes: null,
      });
      if (status !== "attempted") {
        await db.insert(dsaAttempts).values({
          userId,
          problemId: inserted.id,
          attemptDate: lastAttemptDate!,
          result: status === "mastered" ? "optimal" : "solved",
          timeTakenMinutes: timeTakenMinutes ? Math.max(8, timeTakenMinutes - 5) : null,
          confidence,
          notes: null,
        });
      }
    }
  }
}
