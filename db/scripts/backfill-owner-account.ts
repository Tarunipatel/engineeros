/**
 * One-time bootstrap: creates a real `users` row for whoever currently
 * owns this deployment's data (previously gated by a single ADMIN_EMAIL/
 * ADMIN_PASSWORD pair with no user table at all). Idempotent — safe to
 * re-run, it no-ops if the account already exists.
 *
 * Run with:
 *   OWNER_NAME="..." OWNER_EMAIL="..." OWNER_PASSWORD="..." npx tsx db/scripts/backfill-owner-account.ts
 */
import { eq } from "drizzle-orm";
import { db } from "../client";
import { users } from "../schema";
import { hashPassword } from "../../lib/password";

async function main() {
  const name = process.env.OWNER_NAME;
  const email = process.env.OWNER_EMAIL?.trim().toLowerCase();
  const password = process.env.OWNER_PASSWORD;

  if (!name || !email || !password) {
    throw new Error("OWNER_NAME, OWNER_EMAIL, and OWNER_PASSWORD env vars are all required.");
  }

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    console.log(`User ${email} already exists (id ${existing.id}) — nothing to do.`);
    return;
  }

  const [created] = await db
    .insert(users)
    .values({ name, email, passwordHash: hashPassword(password), onboardingCompleted: true })
    .returning();

  console.log(`Created owner account: id ${created.id}, email ${created.email}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
