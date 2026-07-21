import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { applications } from "./applications";
import { users } from "./users";

export type InterviewResult = "pending" | "passed" | "failed" | "no_offer" | "offer";
export type WorkJournalType =
  | "feature_built"
  | "bug_fixed"
  | "interesting_sql"
  | "interesting_python"
  | "architecture_learning"
  | "production_issue"
  | "code_review_feedback"
  | "resume_worthy"
  | "star_story";

export const interviewJournalEntries = sqliteTable(
  "interview_journal_entries",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    company: text("company").notNull(),
    round: text("round").notNull(),
    date: text("date").notNull(),
    questions: text("questions", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
    performanceRating: integer("performance_rating"),
    mistakes: text("mistakes"),
    lessons: text("lessons"),
    topicsToRevise: text("topics_to_revise", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
    result: text("result").$type<InterviewResult>().notNull().default("pending"),
    applicationId: integer("application_id").references(() => applications.id),
    createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
  },
  (table) => [
    index("idx_interview_journal_date").on(table.date),
    index("idx_interview_journal_user").on(table.userId),
  ]
);

export const workJournalEntries = sqliteTable(
  "work_journal_entries",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: text("date").notNull(),
    type: text("type").$type<WorkJournalType>().notNull(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    tags: text("tags", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
    createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
    updatedAt: text("updated_at").notNull().default(sql`(current_timestamp)`),
  },
  (table) => [
    index("idx_work_journal_date").on(table.date),
    index("idx_work_journal_type").on(table.type),
    index("idx_work_journal_user").on(table.userId),
  ]
);
