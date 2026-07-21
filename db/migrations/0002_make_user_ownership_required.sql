PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_dsa_attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`problem_id` integer NOT NULL,
	`attempt_date` text NOT NULL,
	`result` text NOT NULL,
	`time_taken_minutes` integer,
	`confidence` integer,
	`notes` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`problem_id`) REFERENCES `dsa_problems`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_dsa_attempts`("id", "user_id", "problem_id", "attempt_date", "result", "time_taken_minutes", "confidence", "notes", "created_at") SELECT "id", "user_id", "problem_id", "attempt_date", "result", "time_taken_minutes", "confidence", "notes", "created_at" FROM `dsa_attempts`;--> statement-breakpoint
DROP TABLE `dsa_attempts`;--> statement-breakpoint
ALTER TABLE `__new_dsa_attempts` RENAME TO `dsa_attempts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_dsa_attempts_problem` ON `dsa_attempts` (`problem_id`);--> statement-breakpoint
CREATE INDEX `idx_dsa_attempts_date` ON `dsa_attempts` (`attempt_date`);--> statement-breakpoint
CREATE INDEX `idx_dsa_attempts_user` ON `dsa_attempts` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_dsa_problems` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`title` text NOT NULL,
	`platform` text DEFAULT 'LeetCode' NOT NULL,
	`url` text,
	`difficulty` text NOT NULL,
	`topic_id` integer NOT NULL,
	`pattern_id` integer,
	`company_tags` text DEFAULT '[]' NOT NULL,
	`is_core` integer DEFAULT true NOT NULL,
	`status` text DEFAULT 'not_started' NOT NULL,
	`favorite` integer DEFAULT false NOT NULL,
	`time_taken_minutes` integer,
	`confidence` integer,
	`mistakes` text,
	`notes` text,
	`first_attempt_date` text,
	`last_attempt_date` text,
	`revision_count` integer DEFAULT 0 NOT NULL,
	`next_revision_date` text,
	`ease_factor` real DEFAULT 2.5 NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`topic_id`) REFERENCES `dsa_topics`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`pattern_id`) REFERENCES `dsa_patterns`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_dsa_problems`("id", "user_id", "title", "platform", "url", "difficulty", "topic_id", "pattern_id", "company_tags", "is_core", "status", "favorite", "time_taken_minutes", "confidence", "mistakes", "notes", "first_attempt_date", "last_attempt_date", "revision_count", "next_revision_date", "ease_factor", "created_at", "updated_at") SELECT "id", "user_id", "title", "platform", "url", "difficulty", "topic_id", "pattern_id", "company_tags", "is_core", "status", "favorite", "time_taken_minutes", "confidence", "mistakes", "notes", "first_attempt_date", "last_attempt_date", "revision_count", "next_revision_date", "ease_factor", "created_at", "updated_at" FROM `dsa_problems`;--> statement-breakpoint
DROP TABLE `dsa_problems`;--> statement-breakpoint
ALTER TABLE `__new_dsa_problems` RENAME TO `dsa_problems`;--> statement-breakpoint
CREATE INDEX `idx_dsa_problems_status` ON `dsa_problems` (`status`);--> statement-breakpoint
CREATE INDEX `idx_dsa_problems_topic` ON `dsa_problems` (`topic_id`);--> statement-breakpoint
CREATE INDEX `idx_dsa_problems_next_revision` ON `dsa_problems` (`next_revision_date`);--> statement-breakpoint
CREATE INDEX `idx_dsa_problems_difficulty` ON `dsa_problems` (`difficulty`);--> statement-breakpoint
CREATE INDEX `idx_dsa_problems_user` ON `dsa_problems` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_roadmap_topics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`domain_id` integer NOT NULL,
	`section_id` integer,
	`title` text NOT NULL,
	`difficulty` text,
	`estimated_minutes` integer,
	`status` text DEFAULT 'not_started' NOT NULL,
	`notes` text,
	`resources` text DEFAULT '[]' NOT NULL,
	`completed_at` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`domain_id`) REFERENCES `roadmap_domains`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`section_id`) REFERENCES `roadmap_sections`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_roadmap_topics`("id", "user_id", "domain_id", "section_id", "title", "difficulty", "estimated_minutes", "status", "notes", "resources", "completed_at", "sort_order") SELECT "id", "user_id", "domain_id", "section_id", "title", "difficulty", "estimated_minutes", "status", "notes", "resources", "completed_at", "sort_order" FROM `roadmap_topics`;--> statement-breakpoint
DROP TABLE `roadmap_topics`;--> statement-breakpoint
ALTER TABLE `__new_roadmap_topics` RENAME TO `roadmap_topics`;--> statement-breakpoint
CREATE INDEX `idx_roadmap_topics_domain` ON `roadmap_topics` (`domain_id`);--> statement-breakpoint
CREATE INDEX `idx_roadmap_topics_status` ON `roadmap_topics` (`status`);--> statement-breakpoint
CREATE INDEX `idx_roadmap_topics_user` ON `roadmap_topics` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_daily_plan_problems` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`daily_plan_id` integer NOT NULL,
	`problem_id` integer NOT NULL,
	`kind` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`daily_plan_id`) REFERENCES `daily_plans`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`problem_id`) REFERENCES `dsa_problems`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_daily_plan_problems`("id", "user_id", "daily_plan_id", "problem_id", "kind", "completed") SELECT "id", "user_id", "daily_plan_id", "problem_id", "kind", "completed" FROM `daily_plan_problems`;--> statement-breakpoint
DROP TABLE `daily_plan_problems`;--> statement-breakpoint
ALTER TABLE `__new_daily_plan_problems` RENAME TO `daily_plan_problems`;--> statement-breakpoint
CREATE INDEX `idx_daily_plan_problems_plan` ON `daily_plan_problems` (`daily_plan_id`);--> statement-breakpoint
CREATE INDEX `idx_daily_plan_problems_user` ON `daily_plan_problems` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_daily_plans` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`date` text NOT NULL,
	`system_design_topic_id` integer,
	`python_topic_id` integer,
	`postgresql_topic_id` integer,
	`core_cs_topic_id` integer,
	`work_reflection` text,
	`end_of_day_reflection` text,
	`notes` text,
	`study_goal_minutes` integer,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`system_design_topic_id`) REFERENCES `roadmap_topics`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`python_topic_id`) REFERENCES `roadmap_topics`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`postgresql_topic_id`) REFERENCES `roadmap_topics`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`core_cs_topic_id`) REFERENCES `roadmap_topics`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_daily_plans`("id", "user_id", "date", "system_design_topic_id", "python_topic_id", "postgresql_topic_id", "core_cs_topic_id", "work_reflection", "end_of_day_reflection", "notes", "study_goal_minutes", "created_at") SELECT "id", "user_id", "date", "system_design_topic_id", "python_topic_id", "postgresql_topic_id", "core_cs_topic_id", "work_reflection", "end_of_day_reflection", "notes", "study_goal_minutes", "created_at" FROM `daily_plans`;--> statement-breakpoint
DROP TABLE `daily_plans`;--> statement-breakpoint
ALTER TABLE `__new_daily_plans` RENAME TO `daily_plans`;--> statement-breakpoint
CREATE INDEX `idx_daily_plans_date` ON `daily_plans` (`date`);--> statement-breakpoint
CREATE INDEX `idx_daily_plans_user` ON `daily_plans` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_daily_plans_user_date` ON `daily_plans` (`user_id`,`date`);--> statement-breakpoint
CREATE TABLE `__new_study_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`date` text NOT NULL,
	`started_at` text,
	`ended_at` text,
	`duration_minutes` integer DEFAULT 0 NOT NULL,
	`category` text DEFAULT 'other' NOT NULL,
	`related_problem_id` integer,
	`related_topic_id` integer,
	`notes` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`related_problem_id`) REFERENCES `dsa_problems`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`related_topic_id`) REFERENCES `roadmap_topics`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_study_sessions`("id", "user_id", "date", "started_at", "ended_at", "duration_minutes", "category", "related_problem_id", "related_topic_id", "notes", "created_at") SELECT "id", "user_id", "date", "started_at", "ended_at", "duration_minutes", "category", "related_problem_id", "related_topic_id", "notes", "created_at" FROM `study_sessions`;--> statement-breakpoint
DROP TABLE `study_sessions`;--> statement-breakpoint
ALTER TABLE `__new_study_sessions` RENAME TO `study_sessions`;--> statement-breakpoint
CREATE INDEX `idx_study_sessions_date` ON `study_sessions` (`date`);--> statement-breakpoint
CREATE INDEX `idx_study_sessions_user` ON `study_sessions` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_applications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`company` text NOT NULL,
	`role` text NOT NULL,
	`stage` text DEFAULT 'wishlist' NOT NULL,
	`applied_date` text,
	`recruiter_name` text,
	`referral` integer DEFAULT false NOT NULL,
	`salary` text,
	`notes` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_applications`("id", "user_id", "company", "role", "stage", "applied_date", "recruiter_name", "referral", "salary", "notes", "sort_order", "created_at", "updated_at") SELECT "id", "user_id", "company", "role", "stage", "applied_date", "recruiter_name", "referral", "salary", "notes", "sort_order", "created_at", "updated_at" FROM `applications`;--> statement-breakpoint
DROP TABLE `applications`;--> statement-breakpoint
ALTER TABLE `__new_applications` RENAME TO `applications`;--> statement-breakpoint
CREATE INDEX `idx_applications_stage` ON `applications` (`stage`);--> statement-breakpoint
CREATE INDEX `idx_applications_user` ON `applications` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_interview_journal_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`company` text NOT NULL,
	`round` text NOT NULL,
	`date` text NOT NULL,
	`questions` text DEFAULT '[]' NOT NULL,
	`performance_rating` integer,
	`mistakes` text,
	`lessons` text,
	`topics_to_revise` text DEFAULT '[]' NOT NULL,
	`result` text DEFAULT 'pending' NOT NULL,
	`application_id` integer,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_interview_journal_entries`("id", "user_id", "company", "round", "date", "questions", "performance_rating", "mistakes", "lessons", "topics_to_revise", "result", "application_id", "created_at") SELECT "id", "user_id", "company", "round", "date", "questions", "performance_rating", "mistakes", "lessons", "topics_to_revise", "result", "application_id", "created_at" FROM `interview_journal_entries`;--> statement-breakpoint
DROP TABLE `interview_journal_entries`;--> statement-breakpoint
ALTER TABLE `__new_interview_journal_entries` RENAME TO `interview_journal_entries`;--> statement-breakpoint
CREATE INDEX `idx_interview_journal_date` ON `interview_journal_entries` (`date`);--> statement-breakpoint
CREATE INDEX `idx_interview_journal_user` ON `interview_journal_entries` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_work_journal_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`date` text NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`tags` text DEFAULT '[]' NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_work_journal_entries`("id", "user_id", "date", "type", "title", "content", "tags", "created_at", "updated_at") SELECT "id", "user_id", "date", "type", "title", "content", "tags", "created_at", "updated_at" FROM `work_journal_entries`;--> statement-breakpoint
DROP TABLE `work_journal_entries`;--> statement-breakpoint
ALTER TABLE `__new_work_journal_entries` RENAME TO `work_journal_entries`;--> statement-breakpoint
CREATE INDEX `idx_work_journal_date` ON `work_journal_entries` (`date`);--> statement-breakpoint
CREATE INDEX `idx_work_journal_type` ON `work_journal_entries` (`type`);--> statement-breakpoint
CREATE INDEX `idx_work_journal_user` ON `work_journal_entries` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_weekly_reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`week_start_date` text NOT NULL,
	`week_end_date` text NOT NULL,
	`hours_studied` real DEFAULT 0 NOT NULL,
	`problems_solved` integer DEFAULT 0 NOT NULL,
	`topics_finished` integer DEFAULT 0 NOT NULL,
	`applications_submitted` integer DEFAULT 0 NOT NULL,
	`interviews_completed` integer DEFAULT 0 NOT NULL,
	`biggest_win` text,
	`biggest_weakness` text,
	`next_week_goals` text,
	`generated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_weekly_reviews`("id", "user_id", "week_start_date", "week_end_date", "hours_studied", "problems_solved", "topics_finished", "applications_submitted", "interviews_completed", "biggest_win", "biggest_weakness", "next_week_goals", "generated_at") SELECT "id", "user_id", "week_start_date", "week_end_date", "hours_studied", "problems_solved", "topics_finished", "applications_submitted", "interviews_completed", "biggest_win", "biggest_weakness", "next_week_goals", "generated_at" FROM `weekly_reviews`;--> statement-breakpoint
DROP TABLE `weekly_reviews`;--> statement-breakpoint
ALTER TABLE `__new_weekly_reviews` RENAME TO `weekly_reviews`;--> statement-breakpoint
CREATE INDEX `idx_weekly_reviews_user` ON `weekly_reviews` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_weekly_reviews_user_week` ON `weekly_reviews` (`user_id`,`week_start_date`);--> statement-breakpoint
CREATE TABLE `__new_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`theme` text DEFAULT 'dark' NOT NULL,
	`weekly_goal_hours` real DEFAULT 20 NOT NULL,
	`daily_target_minutes` integer DEFAULT 120 NOT NULL,
	`working_hours_start` text DEFAULT '09:00' NOT NULL,
	`working_hours_end` text DEFAULT '18:00' NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_settings`("id", "user_id", "theme", "weekly_goal_hours", "daily_target_minutes", "working_hours_start", "working_hours_end", "updated_at") SELECT "id", "user_id", "theme", "weekly_goal_hours", "daily_target_minutes", "working_hours_start", "working_hours_end", "updated_at" FROM `settings`;--> statement-breakpoint
DROP TABLE `settings`;--> statement-breakpoint
ALTER TABLE `__new_settings` RENAME TO `settings`;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_settings_user` ON `settings` (`user_id`);