import { db } from "../client";
import { dsaTopics, dsaPatterns, dsaProblems, dsaAttempts } from "../schema";
import { DSA_TOPICS, DSA_PATTERNS } from "./data/dsa-topics.data";
import { DSA_PROBLEMS } from "./data/dsa-problems.data";
import { addDays, today } from "../../lib/date";
import { computeNextRevision } from "../../lib/spaced-repetition";

export async function seedDsa() {
  const topicRows = await db
    .insert(dsaTopics)
    .values(DSA_TOPICS.map((name, i) => ({ name, sortOrder: i })))
    .returning();
  const topicIdByName = new Map(topicRows.map((t) => [t.name, t.id]));

  const patternRows = await db
    .insert(dsaPatterns)
    .values(DSA_PATTERNS.map((name, i) => ({ name, sortOrder: i })))
    .returning();
  const patternIdByName = new Map(patternRows.map((p) => [p.name, p.id]));

  for (let i = 0; i < DSA_PROBLEMS.length; i++) {
    const p = DSA_PROBLEMS[i];
    const mod = i % 5;
    // 0,1 -> mastered/solved (40%), 2 -> attempted (20%), 3,4 -> not_started (40%)
    const status = mod === 0 ? "mastered" : mod === 1 ? "solved" : mod === 2 ? "attempted" : "not_started";

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
        title: p.title,
        platform: p.platform,
        url: p.url,
        difficulty: p.difficulty,
        topicId: topicIdByName.get(p.topic)!,
        patternId: patternIdByName.get(p.pattern) ?? null,
        companyTags: p.companyTags,
        status,
        favorite: i % 11 === 0,
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
        problemId: inserted.id,
        attemptDate: firstAttemptDate,
        result,
        timeTakenMinutes,
        confidence,
        notes: null,
      });
      if (status !== "attempted") {
        await db.insert(dsaAttempts).values({
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
