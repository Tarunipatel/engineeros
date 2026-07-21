"use server";

import { randomBytes } from "node:crypto";
import { db } from "@/db/client";
import { settings, invites } from "@/db/schema";
import type { Theme } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { clearAllProgress } from "@/db/seed/clear-progress";
import { requireAuthenticatedUser, hashToken } from "@/lib/session";

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Generates a one-time registration invite. Returns the raw token to show
 * once — only its hash is stored, so this is the only chance to see it.
 */
export async function createInvite(email?: string) {
  const user = await requireAuthenticatedUser();
  const token = randomBytes(24).toString("hex");
  await db.insert(invites).values({
    email: email?.trim().toLowerCase() || null,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + INVITE_TTL_MS).toISOString(),
    createdBy: user.id,
  });
  return token;
}

export async function updateSettings(
  fields: Partial<{
    theme: Theme;
    weeklyGoalHours: number;
    dailyTargetMinutes: number;
    workingHoursStart: string;
    workingHoursEnd: string;
  }>
) {
  const user = await requireAuthenticatedUser();
  const [existing] = await db.select().from(settings).where(eq(settings.userId, user.id)).limit(1);
  if (existing) {
    await db
      .update(settings)
      .set({ ...fields, updatedAt: new Date().toISOString() })
      .where(eq(settings.id, existing.id));
  } else {
    await db.insert(settings).values({ ...fields, userId: user.id });
  }
  revalidatePath("/settings");
  revalidatePath("/");
}

/** Zeroes all tracked progress (DSA statuses, sessions, journals, applications, reviews) while keeping the problem/roadmap catalog. */
export async function clearProgressData() {
  const user = await requireAuthenticatedUser();
  await clearAllProgress(user.id);
  revalidatePath("/");
  revalidatePath("/settings");
}
