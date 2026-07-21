"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq, and, isNull, gt } from "drizzle-orm";
import { db } from "@/db/client";
import { users, invites } from "@/db/schema";
import { hashPassword, passwordPolicyError } from "@/lib/password";
import { createSession, hashToken } from "@/lib/session";
import { seedNewUserCatalog } from "@/db/seed/seed-new-user";
import { checkRateLimit } from "@/lib/rate-limit";

export type RegisterState = { error?: string };

export async function register(_prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(`register:${ip}`, 5, 10 * 60 * 1000)) {
    return { error: "Too many attempts. Wait a few minutes and try again." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const inviteToken = String(formData.get("invite") ?? "").trim();

  if (!name || !email) return { error: "Name and email are required." };

  const policyError = passwordPolicyError(password);
  if (policyError) return { error: policyError };

  if (!inviteToken) return { error: "A valid invite link is required to register." };

  const nowIso = new Date().toISOString();
  const [invite] = await db
    .select()
    .from(invites)
    .where(and(eq(invites.tokenHash, hashToken(inviteToken)), isNull(invites.usedAt), gt(invites.expiresAt, nowIso)))
    .limit(1);

  if (!invite) return { error: "This invite link is invalid, expired, or already used." };
  if (invite.email && invite.email !== email) {
    return { error: "This invite was issued for a different email address." };
  }

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing) return { error: "An account with this email already exists." };

  const [user] = await db
    .insert(users)
    .values({ name, email, passwordHash: hashPassword(password) })
    .returning();

  await db.update(invites).set({ usedAt: nowIso }).where(eq(invites.id, invite.id));
  await seedNewUserCatalog(user.id);

  await createSession(user.id);
  redirect("/");
}
