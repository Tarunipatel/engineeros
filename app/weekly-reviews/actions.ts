"use server";

import { generateWeeklyReview } from "@/lib/weekly-review";
import { db } from "@/db/client";
import { weeklyReviews } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAuthenticatedUser } from "@/lib/session";

export async function regenerateWeeklyReview(weekStartDate?: string) {
  const user = await requireAuthenticatedUser();
  const review = await generateWeeklyReview(user.id, weekStartDate);
  revalidatePath("/weekly-reviews");
  if (review) revalidatePath(`/weekly-reviews/${review.weekStartDate}`);
  return review;
}

export async function updateWeeklyReviewNotes(
  id: number,
  fields: Partial<{ biggestWin: string; biggestWeakness: string; nextWeekGoals: string }>
) {
  const user = await requireAuthenticatedUser();
  await db
    .update(weeklyReviews)
    .set(fields)
    .where(and(eq(weeklyReviews.id, id), eq(weeklyReviews.userId, user.id)));
  revalidatePath("/weekly-reviews");
}
