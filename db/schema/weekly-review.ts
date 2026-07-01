import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const weeklyReviews = sqliteTable("weekly_reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  weekStartDate: text("week_start_date").notNull().unique(),
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
});
