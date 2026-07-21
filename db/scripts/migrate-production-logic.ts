import type { Client } from "@libsql/client";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import * as schema from "../schema";
import { hashPassword } from "../../lib/password";

/**
 * The actual multi-user cutover logic, shared between the production route
 * (app/api/admin/migrate-production/route.ts) and its scratch-DB test
 * script, so both run the literal same code — not a re-transcription that
 * could drift from what was tested.
 *
 * Order matters: create tables -> add nullable user_id -> backfill every
 * existing row to the owner account -> only then enforce NOT NULL, so the
 * constraint never fails against real data. Every step checks whether it's
 * already done first, so this is safe to re-run.
 */

const MIGRATION_0000 = [
  `CREATE TABLE users (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    timezone text,
    onboarding_completed integer DEFAULT false NOT NULL,
    created_at text DEFAULT (current_timestamp) NOT NULL,
    updated_at text DEFAULT (current_timestamp) NOT NULL
  )`,
  `CREATE UNIQUE INDEX users_email_unique ON users (email)`,
  `CREATE TABLE sessions (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    user_id integer NOT NULL,
    token_hash text NOT NULL,
    expires_at text NOT NULL,
    created_at text DEFAULT (current_timestamp) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE no action ON DELETE cascade
  )`,
  `CREATE UNIQUE INDEX sessions_token_hash_unique ON sessions (token_hash)`,
  `CREATE TABLE invites (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    email text,
    token_hash text NOT NULL,
    expires_at text NOT NULL,
    used_at text,
    created_by integer,
    created_at text DEFAULT (current_timestamp) NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON UPDATE no action ON DELETE no action
  )`,
  `CREATE UNIQUE INDEX invites_token_hash_unique ON invites (token_hash)`,
];

const MIGRATION_0001 = [
  `DROP INDEX daily_plans_date_unique`,
  `ALTER TABLE daily_plans ADD user_id integer REFERENCES users(id)`,
  `CREATE INDEX idx_daily_plans_user ON daily_plans (user_id)`,
  `CREATE UNIQUE INDEX idx_daily_plans_user_date ON daily_plans (user_id,date)`,
  `DROP INDEX weekly_reviews_week_start_date_unique`,
  `ALTER TABLE weekly_reviews ADD user_id integer REFERENCES users(id)`,
  `CREATE INDEX idx_weekly_reviews_user ON weekly_reviews (user_id)`,
  `CREATE UNIQUE INDEX idx_weekly_reviews_user_week ON weekly_reviews (user_id,week_start_date)`,
  `ALTER TABLE dsa_attempts ADD user_id integer REFERENCES users(id)`,
  `CREATE INDEX idx_dsa_attempts_user ON dsa_attempts (user_id)`,
  `ALTER TABLE dsa_problems ADD user_id integer REFERENCES users(id)`,
  `CREATE INDEX idx_dsa_problems_user ON dsa_problems (user_id)`,
  `ALTER TABLE roadmap_topics ADD user_id integer REFERENCES users(id)`,
  `CREATE INDEX idx_roadmap_topics_user ON roadmap_topics (user_id)`,
  `ALTER TABLE daily_plan_problems ADD user_id integer REFERENCES users(id)`,
  `CREATE INDEX idx_daily_plan_problems_user ON daily_plan_problems (user_id)`,
  `ALTER TABLE study_sessions ADD user_id integer REFERENCES users(id)`,
  `CREATE INDEX idx_study_sessions_user ON study_sessions (user_id)`,
  `ALTER TABLE applications ADD user_id integer REFERENCES users(id)`,
  `CREATE INDEX idx_applications_user ON applications (user_id)`,
  `ALTER TABLE interview_journal_entries ADD user_id integer REFERENCES users(id)`,
  `CREATE INDEX idx_interview_journal_user ON interview_journal_entries (user_id)`,
  `ALTER TABLE work_journal_entries ADD user_id integer REFERENCES users(id)`,
  `CREATE INDEX idx_work_journal_user ON work_journal_entries (user_id)`,
  `ALTER TABLE settings ADD user_id integer REFERENCES users(id)`,
  `CREATE UNIQUE INDEX idx_settings_user ON settings (user_id)`,
];

const OWNERED_TABLES = [
  "dsa_problems",
  "dsa_attempts",
  "daily_plans",
  "daily_plan_problems",
  "study_sessions",
  "roadmap_topics",
  "applications",
  "interview_journal_entries",
  "work_journal_entries",
  "weekly_reviews",
  "settings",
];

/**
 * `ALTER TABLE ADD COLUMN` appends the new column at the physical end of
 * the table regardless of where the schema declares it — so `INSERT INTO
 * __new_x SELECT * FROM x` silently shifts every column by one and
 * corrupts data. Column names must be listed explicitly, matched by name
 * on both sides, never positionally.
 */
function rebuildTableNotNull(table: string, columns: string, fks: string, columnNames: string[]) {
  const names = columnNames.join(", ");
  return [
    `CREATE TABLE __new_${table} (${columns}${fks})`,
    `INSERT INTO __new_${table} (${names}) SELECT ${names} FROM ${table}`,
    `DROP TABLE ${table}`,
    `ALTER TABLE __new_${table} RENAME TO ${table}`,
  ];
}

const MIGRATION_0002_STATEMENTS = [
  ...rebuildTableNotNull(
    "dsa_attempts",
    `id integer PRIMARY KEY AUTOINCREMENT NOT NULL, user_id integer NOT NULL, problem_id integer NOT NULL, attempt_date text NOT NULL, result text NOT NULL, time_taken_minutes integer, confidence integer, notes text, created_at text DEFAULT (current_timestamp) NOT NULL`,
    `, FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE no action ON DELETE cascade, FOREIGN KEY (problem_id) REFERENCES dsa_problems(id) ON UPDATE no action ON DELETE cascade`,
    ["id", "user_id", "problem_id", "attempt_date", "result", "time_taken_minutes", "confidence", "notes", "created_at"]
  ),
  `CREATE INDEX idx_dsa_attempts_problem ON dsa_attempts (problem_id)`,
  `CREATE INDEX idx_dsa_attempts_date ON dsa_attempts (attempt_date)`,
  `CREATE INDEX idx_dsa_attempts_user ON dsa_attempts (user_id)`,
  ...rebuildTableNotNull(
    "dsa_problems",
    `id integer PRIMARY KEY AUTOINCREMENT NOT NULL, user_id integer NOT NULL, title text NOT NULL, platform text DEFAULT 'LeetCode' NOT NULL, url text, difficulty text NOT NULL, topic_id integer NOT NULL, pattern_id integer, company_tags text DEFAULT '[]' NOT NULL, is_core integer DEFAULT true NOT NULL, status text DEFAULT 'not_started' NOT NULL, favorite integer DEFAULT false NOT NULL, time_taken_minutes integer, confidence integer, mistakes text, notes text, first_attempt_date text, last_attempt_date text, revision_count integer DEFAULT 0 NOT NULL, next_revision_date text, ease_factor real DEFAULT 2.5 NOT NULL, created_at text DEFAULT (current_timestamp) NOT NULL, updated_at text DEFAULT (current_timestamp) NOT NULL`,
    `, FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE no action ON DELETE cascade, FOREIGN KEY (topic_id) REFERENCES dsa_topics(id) ON UPDATE no action ON DELETE no action, FOREIGN KEY (pattern_id) REFERENCES dsa_patterns(id) ON UPDATE no action ON DELETE no action`,
    [
      "id", "user_id", "title", "platform", "url", "difficulty", "topic_id", "pattern_id", "company_tags",
      "is_core", "status", "favorite", "time_taken_minutes", "confidence", "mistakes", "notes",
      "first_attempt_date", "last_attempt_date", "revision_count", "next_revision_date", "ease_factor",
      "created_at", "updated_at",
    ]
  ),
  `CREATE INDEX idx_dsa_problems_status ON dsa_problems (status)`,
  `CREATE INDEX idx_dsa_problems_topic ON dsa_problems (topic_id)`,
  `CREATE INDEX idx_dsa_problems_next_revision ON dsa_problems (next_revision_date)`,
  `CREATE INDEX idx_dsa_problems_difficulty ON dsa_problems (difficulty)`,
  `CREATE INDEX idx_dsa_problems_user ON dsa_problems (user_id)`,
  ...rebuildTableNotNull(
    "roadmap_topics",
    `id integer PRIMARY KEY AUTOINCREMENT NOT NULL, user_id integer NOT NULL, domain_id integer NOT NULL, section_id integer, title text NOT NULL, difficulty text, estimated_minutes integer, status text DEFAULT 'not_started' NOT NULL, notes text, resources text DEFAULT '[]' NOT NULL, completed_at text, sort_order integer DEFAULT 0 NOT NULL`,
    `, FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE no action ON DELETE cascade, FOREIGN KEY (domain_id) REFERENCES roadmap_domains(id) ON UPDATE no action ON DELETE no action, FOREIGN KEY (section_id) REFERENCES roadmap_sections(id) ON UPDATE no action ON DELETE no action`,
    ["id", "user_id", "domain_id", "section_id", "title", "difficulty", "estimated_minutes", "status", "notes", "resources", "completed_at", "sort_order"]
  ),
  `CREATE INDEX idx_roadmap_topics_domain ON roadmap_topics (domain_id)`,
  `CREATE INDEX idx_roadmap_topics_status ON roadmap_topics (status)`,
  `CREATE INDEX idx_roadmap_topics_user ON roadmap_topics (user_id)`,
  ...rebuildTableNotNull(
    "daily_plan_problems",
    `id integer PRIMARY KEY AUTOINCREMENT NOT NULL, user_id integer NOT NULL, daily_plan_id integer NOT NULL, problem_id integer NOT NULL, kind text NOT NULL, completed integer DEFAULT false NOT NULL`,
    `, FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE no action ON DELETE cascade, FOREIGN KEY (daily_plan_id) REFERENCES daily_plans(id) ON UPDATE no action ON DELETE cascade, FOREIGN KEY (problem_id) REFERENCES dsa_problems(id) ON UPDATE no action ON DELETE cascade`,
    ["id", "user_id", "daily_plan_id", "problem_id", "kind", "completed"]
  ),
  `CREATE INDEX idx_daily_plan_problems_plan ON daily_plan_problems (daily_plan_id)`,
  `CREATE INDEX idx_daily_plan_problems_user ON daily_plan_problems (user_id)`,
  ...rebuildTableNotNull(
    "daily_plans",
    `id integer PRIMARY KEY AUTOINCREMENT NOT NULL, user_id integer NOT NULL, date text NOT NULL, system_design_topic_id integer, python_topic_id integer, postgresql_topic_id integer, core_cs_topic_id integer, work_reflection text, end_of_day_reflection text, notes text, study_goal_minutes integer, created_at text DEFAULT (current_timestamp) NOT NULL`,
    `, FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE no action ON DELETE cascade, FOREIGN KEY (system_design_topic_id) REFERENCES roadmap_topics(id) ON UPDATE no action ON DELETE no action, FOREIGN KEY (python_topic_id) REFERENCES roadmap_topics(id) ON UPDATE no action ON DELETE no action, FOREIGN KEY (postgresql_topic_id) REFERENCES roadmap_topics(id) ON UPDATE no action ON DELETE no action, FOREIGN KEY (core_cs_topic_id) REFERENCES roadmap_topics(id) ON UPDATE no action ON DELETE no action`,
    ["id", "user_id", "date", "system_design_topic_id", "python_topic_id", "postgresql_topic_id", "core_cs_topic_id", "work_reflection", "end_of_day_reflection", "notes", "study_goal_minutes", "created_at"]
  ),
  `CREATE INDEX idx_daily_plans_date ON daily_plans (date)`,
  `CREATE INDEX idx_daily_plans_user ON daily_plans (user_id)`,
  `CREATE UNIQUE INDEX idx_daily_plans_user_date ON daily_plans (user_id,date)`,
  ...rebuildTableNotNull(
    "study_sessions",
    `id integer PRIMARY KEY AUTOINCREMENT NOT NULL, user_id integer NOT NULL, date text NOT NULL, started_at text, ended_at text, duration_minutes integer DEFAULT 0 NOT NULL, category text DEFAULT 'other' NOT NULL, related_problem_id integer, related_topic_id integer, notes text, created_at text DEFAULT (current_timestamp) NOT NULL`,
    `, FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE no action ON DELETE cascade, FOREIGN KEY (related_problem_id) REFERENCES dsa_problems(id) ON UPDATE no action ON DELETE no action, FOREIGN KEY (related_topic_id) REFERENCES roadmap_topics(id) ON UPDATE no action ON DELETE no action`,
    ["id", "user_id", "date", "started_at", "ended_at", "duration_minutes", "category", "related_problem_id", "related_topic_id", "notes", "created_at"]
  ),
  `CREATE INDEX idx_study_sessions_date ON study_sessions (date)`,
  `CREATE INDEX idx_study_sessions_user ON study_sessions (user_id)`,
  ...rebuildTableNotNull(
    "applications",
    `id integer PRIMARY KEY AUTOINCREMENT NOT NULL, user_id integer NOT NULL, company text NOT NULL, role text NOT NULL, stage text DEFAULT 'wishlist' NOT NULL, applied_date text, recruiter_name text, referral integer DEFAULT false NOT NULL, salary text, notes text, sort_order integer DEFAULT 0 NOT NULL, created_at text DEFAULT (current_timestamp) NOT NULL, updated_at text DEFAULT (current_timestamp) NOT NULL`,
    `, FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE no action ON DELETE cascade`,
    ["id", "user_id", "company", "role", "stage", "applied_date", "recruiter_name", "referral", "salary", "notes", "sort_order", "created_at", "updated_at"]
  ),
  `CREATE INDEX idx_applications_stage ON applications (stage)`,
  `CREATE INDEX idx_applications_user ON applications (user_id)`,
  ...rebuildTableNotNull(
    "interview_journal_entries",
    `id integer PRIMARY KEY AUTOINCREMENT NOT NULL, user_id integer NOT NULL, company text NOT NULL, round text NOT NULL, date text NOT NULL, questions text DEFAULT '[]' NOT NULL, performance_rating integer, mistakes text, lessons text, topics_to_revise text DEFAULT '[]' NOT NULL, result text DEFAULT 'pending' NOT NULL, application_id integer, created_at text DEFAULT (current_timestamp) NOT NULL`,
    `, FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE no action ON DELETE cascade, FOREIGN KEY (application_id) REFERENCES applications(id) ON UPDATE no action ON DELETE no action`,
    ["id", "user_id", "company", "round", "date", "questions", "performance_rating", "mistakes", "lessons", "topics_to_revise", "result", "application_id", "created_at"]
  ),
  `CREATE INDEX idx_interview_journal_date ON interview_journal_entries (date)`,
  `CREATE INDEX idx_interview_journal_user ON interview_journal_entries (user_id)`,
  ...rebuildTableNotNull(
    "work_journal_entries",
    `id integer PRIMARY KEY AUTOINCREMENT NOT NULL, user_id integer NOT NULL, date text NOT NULL, type text NOT NULL, title text NOT NULL, content text NOT NULL, tags text DEFAULT '[]' NOT NULL, created_at text DEFAULT (current_timestamp) NOT NULL, updated_at text DEFAULT (current_timestamp) NOT NULL`,
    `, FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE no action ON DELETE cascade`,
    ["id", "user_id", "date", "type", "title", "content", "tags", "created_at", "updated_at"]
  ),
  `CREATE INDEX idx_work_journal_date ON work_journal_entries (date)`,
  `CREATE INDEX idx_work_journal_type ON work_journal_entries (type)`,
  `CREATE INDEX idx_work_journal_user ON work_journal_entries (user_id)`,
  ...rebuildTableNotNull(
    "weekly_reviews",
    `id integer PRIMARY KEY AUTOINCREMENT NOT NULL, user_id integer NOT NULL, week_start_date text NOT NULL, week_end_date text NOT NULL, hours_studied real DEFAULT 0 NOT NULL, problems_solved integer DEFAULT 0 NOT NULL, topics_finished integer DEFAULT 0 NOT NULL, applications_submitted integer DEFAULT 0 NOT NULL, interviews_completed integer DEFAULT 0 NOT NULL, biggest_win text, biggest_weakness text, next_week_goals text, generated_at text DEFAULT (current_timestamp) NOT NULL`,
    `, FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE no action ON DELETE cascade`,
    ["id", "user_id", "week_start_date", "week_end_date", "hours_studied", "problems_solved", "topics_finished", "applications_submitted", "interviews_completed", "biggest_win", "biggest_weakness", "next_week_goals", "generated_at"]
  ),
  `CREATE INDEX idx_weekly_reviews_user ON weekly_reviews (user_id)`,
  `CREATE UNIQUE INDEX idx_weekly_reviews_user_week ON weekly_reviews (user_id,week_start_date)`,
  ...rebuildTableNotNull(
    "settings",
    `id integer PRIMARY KEY AUTOINCREMENT NOT NULL, user_id integer NOT NULL, theme text DEFAULT 'dark' NOT NULL, weekly_goal_hours real DEFAULT 20 NOT NULL, daily_target_minutes integer DEFAULT 120 NOT NULL, working_hours_start text DEFAULT '09:00' NOT NULL, working_hours_end text DEFAULT '18:00' NOT NULL, updated_at text DEFAULT (current_timestamp) NOT NULL`,
    `, FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE no action ON DELETE cascade`,
    ["id", "user_id", "theme", "weekly_goal_hours", "daily_target_minutes", "working_hours_start", "working_hours_end", "updated_at"]
  ),
  `CREATE UNIQUE INDEX idx_settings_user ON settings (user_id)`,
];

async function tableExists(client: Client, name: string) {
  const res = await client.execute({
    sql: "SELECT name FROM sqlite_master WHERE type='table' AND name = ?",
    args: [name],
  });
  return res.rows.length > 0;
}

async function countRows(client: Client, table: string) {
  const res = await client.execute(`SELECT COUNT(*) as c FROM ${table}`);
  return Number(res.rows[0].c);
}

export type MigrationResult =
  | { ok: true; ownerId: number; ownerEmail: string; backfillCounts: Record<string, number>; afterCounts: Record<string, number>; log: string[] }
  | { ok: false; error: string; log: string[]; remainingNulls?: Record<string, number> };

export async function runProductionMigration(
  client: Client,
  db: LibSQLDatabase<typeof schema>,
  opts: { ownerEmail: string; ownerPassword: string; ownerName: string }
): Promise<MigrationResult> {
  const { users } = schema;
  const log: string[] = [];

  if (await tableExists(client, "users")) {
    log.push("users table already exists, skipping migration 0000");
  } else {
    for (const stmt of MIGRATION_0000) await client.execute(stmt);
    log.push("migration 0000 applied (users/sessions/invites)");
  }

  const dsaProblemsCols = await client.execute("PRAGMA table_info(dsa_problems)");
  const dsaProblemsHasUserId = dsaProblemsCols.rows.some((r) => r.name === "user_id");

  if (dsaProblemsHasUserId) {
    log.push("user_id columns already present, skipping migration 0001");
  } else {
    for (const stmt of MIGRATION_0001) await client.execute(stmt);
    log.push("migration 0001 applied (nullable user_id on 11 tables)");
  }

  const ownerEmail = opts.ownerEmail.trim().toLowerCase();
  let [owner] = await db.select({ id: users.id }).from(users).where(eq(users.email, ownerEmail)).limit(1);
  if (!owner) {
    const [created] = await db
      .insert(users)
      .values({
        name: opts.ownerName,
        email: ownerEmail,
        passwordHash: hashPassword(opts.ownerPassword),
        onboardingCompleted: true,
      })
      .returning({ id: users.id });
    owner = created;
    log.push(`created owner user id ${owner.id} (${ownerEmail})`);
  } else {
    log.push(`owner user already exists: id ${owner.id} (${ownerEmail})`);
  }

  const backfillCounts: Record<string, number> = {};
  for (const table of OWNERED_TABLES) {
    const before = await countRows(client, table);
    await client.execute({ sql: `UPDATE ${table} SET user_id = ? WHERE user_id IS NULL`, args: [owner.id] });
    backfillCounts[table] = before;
  }
  log.push(`backfilled rows: ${JSON.stringify(backfillCounts)}`);

  const remainingNulls: Record<string, number> = {};
  for (const table of OWNERED_TABLES) {
    const res = await client.execute(`SELECT COUNT(*) as c FROM ${table} WHERE user_id IS NULL`);
    remainingNulls[table] = Number(res.rows[0].c);
  }
  const anyNulls = Object.values(remainingNulls).some((c) => c > 0);
  if (anyNulls) {
    return { ok: false, error: "NULL user_id remained after backfill, aborting before NOT NULL migration", remainingNulls, log };
  }
  log.push("verified zero NULL user_id across all 11 tables");

  const dsaProblemsInfo = await client.execute("PRAGMA table_info(dsa_problems)");
  const userIdCol = dsaProblemsInfo.rows.find((r) => r.name === "user_id");
  const alreadyNotNull = userIdCol && Number(userIdCol.notnull) === 1;

  if (alreadyNotNull) {
    log.push("user_id already NOT NULL, skipping migration 0002");
  } else {
    await client.execute("PRAGMA foreign_keys=OFF");
    for (const stmt of MIGRATION_0002_STATEMENTS) await client.execute(stmt);
    await client.execute("PRAGMA foreign_keys=ON");
    log.push("migration 0002 applied (user_id NOT NULL on 11 tables)");
  }

  const afterCounts: Record<string, number> = {};
  for (const table of OWNERED_TABLES) {
    afterCounts[table] = await countRows(client, table);
  }

  return { ok: true, ownerId: owner.id, ownerEmail, backfillCounts, afterCounts, log };
}
