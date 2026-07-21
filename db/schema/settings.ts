import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real, uniqueIndex } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export type Theme = "dark" | "light";

export const settings = sqliteTable(
  "settings",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    theme: text("theme").$type<Theme>().notNull().default("dark"),
    weeklyGoalHours: real("weekly_goal_hours").notNull().default(20),
    dailyTargetMinutes: integer("daily_target_minutes").notNull().default(120),
    workingHoursStart: text("working_hours_start").notNull().default("09:00"),
    workingHoursEnd: text("working_hours_end").notNull().default("18:00"),
    updatedAt: text("updated_at").notNull().default(sql`(current_timestamp)`),
  },
  (table) => [uniqueIndex("idx_settings_user").on(table.userId)]
);
