import type { WorkJournalType } from "@/db/schema";

export const WORK_JOURNAL_TYPE_LABELS: Record<WorkJournalType, string> = {
  feature_built: "Feature Built",
  bug_fixed: "Bug Fixed",
  interesting_sql: "Interesting SQL",
  interesting_python: "Interesting Python",
  architecture_learning: "Architecture Learning",
  production_issue: "Production Issue",
  code_review_feedback: "Code Review Feedback",
  resume_worthy: "Resume Worthy",
  star_story: "STAR Story",
};
