"use server";

import { db } from "@/db/client";
import { settings } from "@/db/schema";
import type { Theme } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { clearAllProgress } from "@/db/seed/clear-progress";

export async function updateSettings(
  fields: Partial<{
    theme: Theme;
    weeklyGoalHours: number;
    dailyTargetMinutes: number;
    workingHoursStart: string;
    workingHoursEnd: string;
  }>
) {
  const [existing] = await db.select().from(settings).limit(1);
  if (existing) {
    await db
      .update(settings)
      .set({ ...fields, updatedAt: new Date().toISOString() })
      .where(eq(settings.id, existing.id));
  } else {
    await db.insert(settings).values(fields);
  }
  revalidatePath("/settings");
  revalidatePath("/");
}

/** Zeroes all tracked progress (DSA statuses, sessions, journals, applications, reviews) while keeping the problem/roadmap catalog. */
export async function clearProgressData() {
  await clearAllProgress();
  revalidatePath("/");
  revalidatePath("/settings");
}
