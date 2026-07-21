DROP INDEX `daily_plans_date_unique`;--> statement-breakpoint
ALTER TABLE `daily_plans` ADD `user_id` integer REFERENCES users(id);--> statement-breakpoint
CREATE INDEX `idx_daily_plans_user` ON `daily_plans` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_daily_plans_user_date` ON `daily_plans` (`user_id`,`date`);--> statement-breakpoint
DROP INDEX `weekly_reviews_week_start_date_unique`;--> statement-breakpoint
ALTER TABLE `weekly_reviews` ADD `user_id` integer REFERENCES users(id);--> statement-breakpoint
CREATE INDEX `idx_weekly_reviews_user` ON `weekly_reviews` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_weekly_reviews_user_week` ON `weekly_reviews` (`user_id`,`week_start_date`);--> statement-breakpoint
ALTER TABLE `dsa_attempts` ADD `user_id` integer REFERENCES users(id);--> statement-breakpoint
CREATE INDEX `idx_dsa_attempts_user` ON `dsa_attempts` (`user_id`);--> statement-breakpoint
ALTER TABLE `dsa_problems` ADD `user_id` integer REFERENCES users(id);--> statement-breakpoint
CREATE INDEX `idx_dsa_problems_user` ON `dsa_problems` (`user_id`);--> statement-breakpoint
ALTER TABLE `roadmap_topics` ADD `user_id` integer REFERENCES users(id);--> statement-breakpoint
CREATE INDEX `idx_roadmap_topics_user` ON `roadmap_topics` (`user_id`);--> statement-breakpoint
ALTER TABLE `daily_plan_problems` ADD `user_id` integer REFERENCES users(id);--> statement-breakpoint
CREATE INDEX `idx_daily_plan_problems_user` ON `daily_plan_problems` (`user_id`);--> statement-breakpoint
ALTER TABLE `study_sessions` ADD `user_id` integer REFERENCES users(id);--> statement-breakpoint
CREATE INDEX `idx_study_sessions_user` ON `study_sessions` (`user_id`);--> statement-breakpoint
ALTER TABLE `applications` ADD `user_id` integer REFERENCES users(id);--> statement-breakpoint
CREATE INDEX `idx_applications_user` ON `applications` (`user_id`);--> statement-breakpoint
ALTER TABLE `interview_journal_entries` ADD `user_id` integer REFERENCES users(id);--> statement-breakpoint
CREATE INDEX `idx_interview_journal_user` ON `interview_journal_entries` (`user_id`);--> statement-breakpoint
ALTER TABLE `work_journal_entries` ADD `user_id` integer REFERENCES users(id);--> statement-breakpoint
CREATE INDEX `idx_work_journal_user` ON `work_journal_entries` (`user_id`);--> statement-breakpoint
ALTER TABLE `settings` ADD `user_id` integer REFERENCES users(id);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_settings_user` ON `settings` (`user_id`);