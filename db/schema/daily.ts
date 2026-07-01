import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { roadmapTopics } from "./roadmaps";
import { dsaProblems } from "./dsa";

export type StudySessionCategory =
  | "dsa"
  | "system_design"
  | "python"
  | "postgresql"
  | "core_cs"
  | "work_journal"
  | "other";

export const dailyPlans = sqliteTable(
  "daily_plans",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    date: text("date").notNull().unique(),
    systemDesignTopicId: integer("system_design_topic_id").references(() => roadmapTopics.id),
    pythonTopicId: integer("python_topic_id").references(() => roadmapTopics.id),
    postgresqlTopicId: integer("postgresql_topic_id").references(() => roadmapTopics.id),
    coreCsTopicId: integer("core_cs_topic_id").references(() => roadmapTopics.id),
    workReflection: text("work_reflection"),
    endOfDayReflection: text("end_of_day_reflection"),
    notes: text("notes"),
    studyGoalMinutes: integer("study_goal_minutes"),
    createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
  },
  (table) => [index("idx_daily_plans_date").on(table.date)]
);

export const dailyPlanProblems = sqliteTable(
  "daily_plan_problems",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    dailyPlanId: integer("daily_plan_id")
      .notNull()
      .references(() => dailyPlans.id, { onDelete: "cascade" }),
    problemId: integer("problem_id")
      .notNull()
      .references(() => dsaProblems.id, { onDelete: "cascade" }),
    kind: text("kind").$type<"new" | "revision">().notNull(),
    completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  },
  (table) => [index("idx_daily_plan_problems_plan").on(table.dailyPlanId)]
);

export const studySessions = sqliteTable(
  "study_sessions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    date: text("date").notNull(),
    startedAt: text("started_at"),
    endedAt: text("ended_at"),
    durationMinutes: integer("duration_minutes").notNull().default(0),
    category: text("category").$type<StudySessionCategory>().notNull().default("other"),
    relatedProblemId: integer("related_problem_id").references(() => dsaProblems.id),
    relatedTopicId: integer("related_topic_id").references(() => roadmapTopics.id),
    notes: text("notes"),
    createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
  },
  (table) => [index("idx_study_sessions_date").on(table.date)]
);
