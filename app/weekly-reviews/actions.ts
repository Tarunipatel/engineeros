"use server";

import { generateWeeklyReview } from "@/lib/weekly-review";
import { db } from "@/db/client";
import { weeklyReviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function regenerateWeeklyReview(weekStartDate?: string) {
  const review = await generateWeeklyReview(weekStartDate);
  revalidatePath("/weekly-reviews");
  if (review) revalidatePath(`/weekly-reviews/${review.weekStartDate}`);
  return review;
}

export async function updateWeeklyReviewNotes(
  id: number,
  fields: Partial<{ biggestWin: string; biggestWeakness: string; nextWeekGoals: string }>
) {
  await db.update(weeklyReviews).set(fields).where(eq(weeklyReviews.id, id));
  revalidatePath("/weekly-reviews");
}
