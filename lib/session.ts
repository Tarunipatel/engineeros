import { randomBytes, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq, gt, and } from "drizzle-orm";
import { db } from "@/db/client";
import { sessions, users } from "@/db/schema";

export const SESSION_COOKIE = "eos_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

/** Shared by session tokens and invite tokens — never store a raw, replayable token. */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Creates a session row and sets the cookie. The cookie holds the raw
 * random token; only its SHA-256 hash is ever stored, so a DB read alone
 * can't be replayed as a valid session.
 */
export async function createSession(userId: number) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString();

  await db.insert(sessions).values({ userId, tokenHash: hashToken(token), expiresAt });

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
  });
}

export async function destroyCurrentSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.tokenHash, hashToken(token)));
  }
  (await cookies()).delete(SESSION_COOKIE);
}

export type CurrentUser = { id: number; name: string; email: string };

/** Returns null if there's no session, or it's invalid/expired — never throws. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const nowIso = new Date().toISOString();
  const [row] = await db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.tokenHash, hashToken(token)), gt(sessions.expiresAt, nowIso)))
    .limit(1);

  return row ?? null;
}

/**
 * Call at the top of every Server Action / Server Component that needs a
 * real user. `redirect()` works from both contexts in the App Router.
 * Middleware is the primary gate; this is defense-in-depth so an action
 * can never run against a client-supplied identity.
 */
export async function requireAuthenticatedUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
