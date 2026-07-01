import { db, libsqlClient, rebuildWorkJournalSearchIndex } from "../client";
import { dsaProblems } from "../schema";
import { seedDsa } from "./seed-dsa";
import { seedRoadmaps } from "./seed-roadmaps";
import { seedStudySessions } from "./seed-study-sessions";
import { seedApplications } from "./seed-applications";
import { seedJournals } from "./seed-journals";
import { seedWeeklyReviews } from "./seed-weekly-reviews";
import { seedSettings } from "./seed-settings";

export async function runSeed() {
  console.log("Seeding DSA topics, patterns, problems, attempts...");
  await seedDsa();
  console.log("Seeding roadmaps (System Design, Python, PostgreSQL, Core CS)...");
  await seedRoadmaps();
  console.log("Seeding backdated study sessions...");
  await seedStudySessions();
  console.log("Seeding applications...");
  await seedApplications();
  console.log("Seeding work journal + interview journal entries...");
  await seedJournals();
  console.log("Generating weekly reviews from seeded data...");
  await seedWeeklyReviews();
  console.log("Seeding settings...");
  await seedSettings();
  console.log("Building work journal search index...");
  await rebuildWorkJournalSearchIndex();
  console.log("Seed complete.");
}

async function main() {
  const [existing] = await db.select().from(dsaProblems).limit(1);
  if (existing) {
    console.log("Database already seeded, skipping.");
    await rebuildWorkJournalSearchIndex();
    libsqlClient.close();
    return;
  }
  await runSeed();
  libsqlClient.close();
}

// Only auto-run when executed directly (`tsx db/seed/index.ts`), not when imported by Server Actions.
if (process.argv[1]?.endsWith("seed/index.ts")) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
