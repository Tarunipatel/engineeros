import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export type RoadmapDomainKey = "system_design" | "python" | "postgresql" | "core_cs";
export type RoadmapDifficulty = "Beginner" | "Intermediate" | "Advanced";
export type RoadmapStatus = "not_started" | "in_progress" | "completed";
export type Resource = { label: string; url: string };

export const roadmapDomains = sqliteTable("roadmap_domains", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").$type<RoadmapDomainKey>().notNull().unique(),
  label: text("label").notNull(),
});

export const roadmapSections = sqliteTable(
  "roadmap_sections",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    domainId: integer("domain_id")
      .notNull()
      .references(() => roadmapDomains.id),
    name: text("name").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [index("idx_roadmap_sections_domain").on(table.domainId)]
);

export const roadmapTopics = sqliteTable(
  "roadmap_topics",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    domainId: integer("domain_id")
      .notNull()
      .references(() => roadmapDomains.id),
    sectionId: integer("section_id").references(() => roadmapSections.id),
    title: text("title").notNull(),
    difficulty: text("difficulty").$type<RoadmapDifficulty>(),
    estimatedMinutes: integer("estimated_minutes"),
    status: text("status").$type<RoadmapStatus>().notNull().default("not_started"),
    notes: text("notes"),
    resources: text("resources", { mode: "json" }).$type<Resource[]>().notNull().default(sql`'[]'`),
    completedAt: text("completed_at"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    index("idx_roadmap_topics_domain").on(table.domainId),
    index("idx_roadmap_topics_status").on(table.status),
    index("idx_roadmap_topics_user").on(table.userId),
  ]
);
