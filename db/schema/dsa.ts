import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real, index } from "drizzle-orm/sqlite-core";

export type Difficulty = "Easy" | "Medium" | "Hard";
export type ProblemStatus = "not_started" | "attempted" | "solved" | "mastered";
export type AttemptResult = "failed" | "solved_with_help" | "solved" | "optimal";

export const dsaTopics = sqliteTable("dsa_topics", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const dsaPatterns = sqliteTable("dsa_patterns", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const dsaProblems = sqliteTable(
  "dsa_problems",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    platform: text("platform").notNull().default("LeetCode"),
    url: text("url"),
    difficulty: text("difficulty").$type<Difficulty>().notNull(),
    topicId: integer("topic_id")
      .notNull()
      .references(() => dsaTopics.id),
    patternId: integer("pattern_id").references(() => dsaPatterns.id),
    companyTags: text("company_tags", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
    // false for problems added purely for company-wise browsing (not part of
    // the curated core set) — keeps the main Table/Kanban/Topic Progress
    // views scoped to the original curriculum while /dsa/companies can still
    // show the full, real per-company list.
    isCore: integer("is_core", { mode: "boolean" }).notNull().default(true),
    status: text("status").$type<ProblemStatus>().notNull().default("not_started"),
    favorite: integer("favorite", { mode: "boolean" }).notNull().default(false),
    timeTakenMinutes: integer("time_taken_minutes"),
    confidence: integer("confidence"),
    mistakes: text("mistakes"),
    notes: text("notes"),
    firstAttemptDate: text("first_attempt_date"),
    lastAttemptDate: text("last_attempt_date"),
    revisionCount: integer("revision_count").notNull().default(0),
    nextRevisionDate: text("next_revision_date"),
    easeFactor: real("ease_factor").notNull().default(2.5),
    createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
    updatedAt: text("updated_at").notNull().default(sql`(current_timestamp)`),
  },
  (table) => [
    index("idx_dsa_problems_status").on(table.status),
    index("idx_dsa_problems_topic").on(table.topicId),
    index("idx_dsa_problems_next_revision").on(table.nextRevisionDate),
    index("idx_dsa_problems_difficulty").on(table.difficulty),
  ]
);

export const dsaAttempts = sqliteTable(
  "dsa_attempts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    problemId: integer("problem_id")
      .notNull()
      .references(() => dsaProblems.id, { onDelete: "cascade" }),
    attemptDate: text("attempt_date").notNull(),
    result: text("result").$type<AttemptResult>().notNull(),
    timeTakenMinutes: integer("time_taken_minutes"),
    confidence: integer("confidence"),
    notes: text("notes"),
    createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
  },
  (table) => [
    index("idx_dsa_attempts_problem").on(table.problemId),
    index("idx_dsa_attempts_date").on(table.attemptDate),
  ]
);
