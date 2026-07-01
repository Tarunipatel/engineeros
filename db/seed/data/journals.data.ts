export type WorkJournalSeed = {
  daysAgo: number;
  type:
    | "feature_built"
    | "bug_fixed"
    | "interesting_sql"
    | "interesting_python"
    | "architecture_learning"
    | "production_issue"
    | "code_review_feedback"
    | "resume_worthy"
    | "star_story";
  title: string;
  content: string;
  tags: string[];
};

export const WORK_JOURNAL_ENTRIES: WorkJournalSeed[] = [
  { daysAgo: 1, type: "feature_built", title: "Shipped bulk CSV export for reports dashboard", content: "Added a streaming CSV export endpoint so large reports (500k+ rows) don't OOM the worker. Used cursor-based pagination internally and piped chunks directly to the response stream instead of building the file in memory.", tags: ["backend", "streaming", "reports"] },
  { daysAgo: 2, type: "interesting_sql", title: "Window functions cut a N+1 report query from 4s to 200ms", content: "Replaced a per-row subquery computing running totals with a single query using SUM() OVER (PARTITION BY account_id ORDER BY created_at). Removed 3 nested loops of application-side aggregation entirely.", tags: ["postgresql", "performance", "window-functions"] },
  { daysAgo: 4, type: "bug_fixed", title: "Fixed race condition in webhook retry queue", content: "Two workers could pick up the same webhook retry job because the SELECT-then-UPDATE wasn't atomic. Fixed with SELECT ... FOR UPDATE SKIP LOCKED so concurrent workers never double-process a job.", tags: ["concurrency", "postgresql", "queues"] },
  { daysAgo: 6, type: "production_issue", title: "Connection pool exhaustion during traffic spike", content: "A marketing email drove a 10x traffic spike and our DB connection pool (size 20) got exhausted, causing cascading 500s. Root cause: a background job held connections open for the full batch instead of releasing per-row. Mitigated by adding pool size alerts and fixing the job to use short-lived connections.", tags: ["incident", "postgresql", "scaling"] },
  { daysAgo: 8, type: "architecture_learning", title: "Why we chose event sourcing for the billing ledger", content: "Read through our billing team's design doc — they use an append-only ledger table instead of mutable balance columns so every balance change is auditable and replayable. Tradeoff is more complex reads (need to fold events), but it eliminated a whole class of reconciliation bugs.", tags: ["architecture", "billing", "event-sourcing"] },
  { daysAgo: 10, type: "code_review_feedback", title: "Reviewer flagged missing idempotency key on payment retry", content: "In review, a senior engineer pointed out my retry logic for failed payment webhooks didn't include an idempotency key, risking double-charging a customer on retry. Added a deterministic key derived from (event_id, attempt) and a unique constraint to enforce it at the DB level.", tags: ["code-review", "payments", "idempotency"] },
  { daysAgo: 13, type: "interesting_python", title: "Async context manager for per-request DB transactions", content: "Wrote a small async context manager wrapping asyncpg transactions so route handlers can just `async with tx():` and get automatic commit/rollback, including nested savepoints for tests.", tags: ["python", "asyncio", "postgresql"] },
  { daysAgo: 15, type: "resume_worthy", title: "Led migration of legacy monolith auth to a shared auth service", content: "Owned the end-to-end migration of authentication logic out of the monolith into a dedicated service used by 6 downstream teams, cutting auth-related incident rate by 70% and unblocking two other teams' roadmaps.", tags: ["leadership", "migration", "auth"] },
  { daysAgo: 18, type: "star_story", title: "STAR: Resolving a cross-team disagreement on API versioning", content: "Situation: two teams disagreed on whether to version the public API via URL path or header. Task: unblock a stalled launch. Action: I prototyped both approaches, measured client migration cost for each, and presented a recommendation with data instead of opinion. Result: team aligned on header versioning within a day, launch shipped on time.", tags: ["star", "cross-team", "leadership"] },
  { daysAgo: 20, type: "feature_built", title: "Built a feature flag rollout percentage UI for PMs", content: "PMs previously needed an engineer to bump rollout percentages. Built a small internal admin panel backed by our existing flag service so they can self-serve gradual rollouts with built-in guardrails (max 20% increase per hour).", tags: ["internal-tools", "feature-flags"] },
  { daysAgo: 23, type: "interesting_sql", title: "Composite index halved slow query time on orders table", content: "A query filtering by (customer_id, status) and sorting by created_at was doing a full table scan. Added a composite index on (customer_id, status, created_at DESC) and query time dropped from 900ms to 40ms on prod data volume.", tags: ["postgresql", "indexes", "performance"] },
  { daysAgo: 27, type: "bug_fixed", title: "Off-by-one in pagination caused duplicate last row across pages", content: "Cursor pagination used `>=` instead of `>` on the cursor comparison, causing the last row of page N to reappear as the first row of page N+1. Fixed the comparison operator and added a regression test with exact-boundary data.", tags: ["pagination", "testing"] },
  { daysAgo: 30, type: "architecture_learning", title: "Read Kafka's design doc on log compaction", content: "Learned how log compaction lets Kafka retain only the latest value per key indefinitely without unbounded storage growth — useful for our idea of using Kafka as a changelog for a materialized view instead of a full event log.", tags: ["kafka", "architecture"] },
  { daysAgo: 34, type: "code_review_feedback", title: "Praised for adding property-based tests to parser change", content: "Got positive feedback in review for adding Hypothesis-based property tests around a date-parsing utility rewrite, which caught 2 edge cases (leap years, DST boundaries) that example-based tests had missed.", tags: ["testing", "python", "code-review"] },
  { daysAgo: 38, type: "production_issue", title: "Silent data loss from unhandled exception in async task", content: "A fire-and-forget asyncio.create_task() swallowed an exception silently because nothing awaited the task or checked its result. Some records never got processed with no error logged. Fixed by adding a task registry with done-callbacks that log exceptions.", tags: ["incident", "asyncio", "python"] },
  { daysAgo: 42, type: "resume_worthy", title: "Reduced CI pipeline time from 22 minutes to 9 minutes", content: "Parallelized test shards across workers and cached dependency installs, cutting average CI wall-clock time by 59% team-wide, saving roughly 40 engineer-hours per week in wait time.", tags: ["ci-cd", "developer-experience"] },
];

export type InterviewJournalSeed = {
  daysAgo: number;
  company: string;
  round: string;
  questions: string[];
  performanceRating: number;
  mistakes: string;
  lessons: string;
  topicsToRevise: string[];
  result: "pending" | "passed" | "failed" | "no_offer" | "offer";
};

export const INTERVIEW_JOURNAL_ENTRIES: InterviewJournalSeed[] = [
  {
    daysAgo: 5,
    company: "Meta",
    round: "Phone Screen",
    questions: ["Longest Substring Without Repeating Characters", "Follow-up: return the substring itself"],
    performanceRating: 4,
    mistakes: "Spent too long on the brute force before jumping to sliding window.",
    lessons: "State the brute force complexity out loud immediately, then pivot faster to the optimal pattern.",
    topicsToRevise: ["Sliding Window"],
    result: "passed",
  },
  {
    daysAgo: 12,
    company: "Google",
    round: "Onsite - Coding Round 1",
    questions: ["Merge K Sorted Lists", "Design a heap-based variant with custom comparator"],
    performanceRating: 3,
    mistakes: "Forgot to handle empty input lists edge case until prompted by interviewer.",
    lessons: "Always enumerate edge cases (empty, single element, all duplicates) before coding.",
    topicsToRevise: ["Heaps", "Edge case checklist"],
    result: "passed",
  },
  {
    daysAgo: 12,
    company: "Google",
    round: "Onsite - System Design",
    questions: ["Design a URL shortener with analytics"],
    performanceRating: 3,
    mistakes: "Didn't discuss capacity estimation numbers early enough, ran out of time on the caching layer.",
    lessons: "Do capacity estimation in the first 5 minutes to anchor scale decisions for the rest of the session.",
    topicsToRevise: ["Consistent Hashing", "Caching", "TinyURL Design"],
    result: "pending",
  },
  {
    daysAgo: 20,
    company: "Amazon",
    round: "Onsite - Bar Raiser",
    questions: ["Course Schedule", "Behavioral: tell me about a conflict with a peer"],
    performanceRating: 2,
    mistakes: "Behavioral answer lacked a clear Result — trailed off without quantifying the outcome.",
    lessons: "Always close STAR answers with a measurable result, even an approximate one.",
    topicsToRevise: ["Graphs", "STAR story bank"],
    result: "failed",
  },
  {
    daysAgo: 35,
    company: "Bloomberg",
    round: "Final Round",
    questions: ["Design a rate limiter", "LRU Cache implementation"],
    performanceRating: 5,
    mistakes: "None significant — solid on both problems.",
    lessons: "Preparing the rate limiter design doc ahead of time paid off directly.",
    topicsToRevise: [],
    result: "offer",
  },
  {
    daysAgo: 48,
    company: "Snowflake",
    round: "Onsite - System Design",
    questions: ["Design a distributed job scheduler"],
    performanceRating: 2,
    mistakes: "Underestimated the complexity of exactly-once execution guarantees, hand-waved the failure recovery story.",
    lessons: "Failure modes deserve as much airtime as the happy path in system design rounds.",
    topicsToRevise: ["Replication", "Sharding", "Kafka"],
    result: "no_offer",
  },
];
