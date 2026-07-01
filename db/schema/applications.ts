import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export type ApplicationStage =
  | "wishlist"
  | "applied"
  | "online_assessment"
  | "interview"
  | "offer"
  | "rejected";

export const applications = sqliteTable(
  "applications",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    company: text("company").notNull(),
    role: text("role").notNull(),
    stage: text("stage").$type<ApplicationStage>().notNull().default("wishlist"),
    appliedDate: text("applied_date"),
    recruiterName: text("recruiter_name"),
    referral: integer("referral", { mode: "boolean" }).notNull().default(false),
    salary: text("salary"),
    notes: text("notes"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
    updatedAt: text("updated_at").notNull().default(sql`(current_timestamp)`),
  },
  (table) => [index("idx_applications_stage").on(table.stage)]
);
