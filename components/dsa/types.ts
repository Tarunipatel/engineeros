import type { dsaTopics, dsaPatterns, dsaAttempts } from "@/db/schema";
import type { Difficulty, ProblemStatus } from "@/db/schema";

export type ProblemWithRelations = {
  id: number;
  title: string;
  platform: string;
  url: string | null;
  difficulty: Difficulty;
  topicId: number;
  patternId: number | null;
  companyTags: string[];
  status: ProblemStatus;
  favorite: boolean;
  timeTakenMinutes: number | null;
  confidence: number | null;
  mistakes: string | null;
  notes: string | null;
  firstAttemptDate: string | null;
  lastAttemptDate: string | null;
  revisionCount: number;
  nextRevisionDate: string | null;
  easeFactor: number;
  topic: typeof dsaTopics.$inferSelect | null;
  pattern: typeof dsaPatterns.$inferSelect | null;
};

export type Topic = typeof dsaTopics.$inferSelect;
export type Pattern = typeof dsaPatterns.$inferSelect;
export type Attempt = typeof dsaAttempts.$inferSelect;

export const STATUS_LABELS: Record<ProblemStatus, string> = {
  not_started: "Not Started",
  attempted: "Attempted",
  solved: "Solved",
  mastered: "Mastered",
};

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Easy: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10",
  Medium: "text-amber-500 border-amber-500/30 bg-amber-500/10",
  Hard: "text-rose-500 border-rose-500/30 bg-rose-500/10",
};
