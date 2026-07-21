import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real, index, uniqueIndex } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const weeklyReviews = sqliteTable(
  "weekly_reviews",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    weekStartDate: text("week_start_date").notNull(),
    weekEndDate: text("week_end_date").notNull(),
    hoursStudied: real("hours_studied").notNull().default(0),
    problemsSolved: integer("problems_solved").notNull().default(0),
    topicsFinished: integer("topics_finished").notNull().default(0),
    applicationsSubmitted: integer("applications_submitted").notNull().default(0),
    interviewsCompleted: integer("interviews_completed").notNull().default(0),
    biggestWin: text("biggest_win"),
    biggestWeakness: text("biggest_weakness"),
    nextWeekGoals: text("next_week_goals"),
    generatedAt: text("generated_at").notNull().default(sql`(current_timestamp)`),
  },
  (table) => [
    index("idx_weekly_reviews_user").on(table.userId),
    uniqueIndex("idx_weekly_reviews_user_week").on(table.userId, table.weekStartDate),
  ]
);
