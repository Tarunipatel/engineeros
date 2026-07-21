import { eq } from "drizzle-orm";
import { db, libsqlClient, rebuildWorkJournalSearchIndex } from "../client";
import { users, dsaProblems } from "../schema";
import { hashPassword } from "../../lib/password";
import { seedDsa } from "./seed-dsa";
import { seedRoadmaps } from "./seed-roadmaps";
import { seedStudySessions } from "./seed-study-sessions";
import { seedApplications } from "./seed-applications";
import { seedJournals } from "./seed-journals";
import { seedWeeklyReviews } from "./seed-weekly-reviews";
import { seedSettings } from "./seed-settings";

/** Full demo dataset (fake progress, applications, journal history) for one bootstrap account — not used for real new signups, see db/seed/seed-new-user.ts for that. */
export async function runSeed(userId: number) {
  console.log("Seeding DSA topics, patterns, problems, attempts...");
  await seedDsa(userId, true);
  console.log("Seeding roadmaps (System Design, Python, PostgreSQL, Core CS)...");
  await seedRoadmaps(userId, true);
  console.log("Seeding backdated study sessions...");
  await seedStudySessions(userId);
  console.log("Seeding applications...");
  await seedApplications(userId);
  console.log("Seeding work journal + interview journal entries...");
  await seedJournals(userId);
  console.log("Generating weekly reviews from seeded data...");
  await seedWeeklyReviews(userId);
  console.log("Seeding settings...");
  await seedSettings(userId);
  console.log("Building work journal search index...");
  await rebuildWorkJournalSearchIndex();
  console.log("Seed complete.");
}

async function ensureDemoOwner() {
  const email = (process.env.OWNER_EMAIL ?? "owner@example.com").trim().toLowerCase();
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing) return existing.id;

  const [created] = await db
    .insert(users)
    .values({
      name: process.env.OWNER_NAME ?? "Demo Owner",
      email,
      passwordHash: hashPassword(process.env.OWNER_PASSWORD ?? "changeme-12345"),
      onboardingCompleted: true,
    })
    .returning();
  console.log(`Created demo owner account: ${created.email} (set OWNER_EMAIL/OWNER_PASSWORD env vars to customize).`);
  return created.id;
}

async function main() {
  const [existing] = await db.select().from(dsaProblems).limit(1);
  if (existing) {
    console.log("Database already seeded, skipping.");
    await rebuildWorkJournalSearchIndex();
    libsqlClient.close();
    return;
  }
  const ownerId = await ensureDemoOwner();
  await runSeed(ownerId);
  libsqlClient.close();
}

// Only auto-run when executed directly (`tsx db/seed/index.ts`), not when imported by Server Actions.
if (process.argv[1]?.endsWith("seed/index.ts")) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
