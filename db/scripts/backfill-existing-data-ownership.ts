/**
 * One-time backfill: assigns every existing row across the 11 user-owned
 * tables to a single owner account (identified by OWNER_EMAIL). Run this
 * once, right after `db:migrate` applies the nullable user_id columns, and
 * before the follow-up migration that flips them NOT NULL.
 *
 * Run with:
 *   OWNER_EMAIL="..." npx tsx db/scripts/backfill-existing-data-ownership.ts
 */
import { eq, isNull } from "drizzle-orm";
import { db } from "../client";
import {
  users,
  dsaProblems,
  dsaAttempts,
  dailyPlans,
  dailyPlanProblems,
  studySessions,
  roadmapTopics,
  applications,
  interviewJournalEntries,
  workJournalEntries,
  weeklyReviews,
  settings,
} from "../schema";

const TABLES = [
  { name: "dsa_problems", table: dsaProblems },
  { name: "dsa_attempts", table: dsaAttempts },
  { name: "daily_plans", table: dailyPlans },
  { name: "daily_plan_problems", table: dailyPlanProblems },
  { name: "study_sessions", table: studySessions },
  { name: "roadmap_topics", table: roadmapTopics },
  { name: "applications", table: applications },
  { name: "interview_journal_entries", table: interviewJournalEntries },
  { name: "work_journal_entries", table: workJournalEntries },
  { name: "weekly_reviews", table: weeklyReviews },
  { name: "settings", table: settings },
] as const;

async function main() {
  const ownerEmail = process.env.OWNER_EMAIL?.trim().toLowerCase();
  if (!ownerEmail) throw new Error("OWNER_EMAIL env var is required.");

  const [owner] = await db.select({ id: users.id }).from(users).where(eq(users.email, ownerEmail)).limit(1);
  if (!owner) throw new Error(`No user found with email ${ownerEmail} — run backfill-owner-account.ts first.`);

  for (const { name, table } of TABLES) {
    const result = await db.update(table).set({ userId: owner.id }).where(isNull(table.userId));
    console.log(`${name}: backfilled ${result.rowsAffected ?? "?"} rows to user ${owner.id}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
